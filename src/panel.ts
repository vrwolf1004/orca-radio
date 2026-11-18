// 사이드바 라디오 패널 로직. 재생은 워커(src/worker.ts)가 띄운 mpv 가 맡는다. 패널은 요청만 보낸다.
// 요소 id 는 panel/index.html 과의 계약이다. 바꾸면 panel/index.html 도 같이 바꾼다.

import { STATIONS, type Station } from './stations'
import { needleLeftPercent, stepVolume } from './logic'
import { applyI18n, cycleLang, t, type Key } from './i18n'

// 패널 프레임의 orca 전역 (sandboxed-ui). 워커의 orca.panels.handle(name) 을 부른다.
declare const orca: { plugin: { request(name: string, input?: unknown): Promise<unknown> } }

interface PlayerStatus {
  state: 'playing' | 'stopped'
  pid: number | null
  volume: number | null
  lastError: string | null
}

const KEY_VOLUME_STEP = 0.05
const DEFAULT_VOLUME = 0.8
const POLL_MS = 1000
// 재생 요청 뒤 mpv 가 뜨기까지 기다려 주는 시간. 이 안에는 '오류'로 바꾸지 않는다.
const START_GRACE_MS = 3000

function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id)
  if (!el) throw new Error(`panel element #${id} not found`)
  return el as T
}

function byClass<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector)
  if (!el) throw new Error(`panel element ${selector} not found`)
  return el
}

const playButton = byId<HTMLButtonElement>('play')
const stopButton = byId<HTMLButtonElement>('stop')
const prevButton = byId<HTMLButtonElement>('prev')
const nextButton = byId<HTMLButtonElement>('next')
const volumeInput = byId<HTMLInputElement>('volume')
const stationName = byId<HTMLElement>('station-name')
const statusText = byId<HTMLElement>('status')
const channelToggle = byId<HTMLButtonElement>('channel-toggle')
const channelDrawer = byId<HTMLElement>('channel-drawer')
const channelWindow = byId<HTMLElement>('channel-window')
const stationList = byId<HTMLUListElement>('station-list')
const radio = byClass<HTMLElement>('.radio')
const needle = byClass<HTMLElement>('.needle')

let index = 0
let wantPlaying = false
let playStartedAt = 0
let listItems: HTMLElement[] = []

function currentStation(): Station {
  return STATIONS[index]
}

function renderStationList(): void {
  stationList.replaceChildren()
  listItems = STATIONS.map((station, i) => {
    const li = document.createElement('li')
    const button = document.createElement('button')
    button.type = 'button'
    const name = document.createElement('span')
    name.textContent = station.name
    const freq = document.createElement('span')
    freq.textContent = station.freq.toFixed(1)
    button.append(name, freq)
    button.addEventListener('click', () => {
      setWindowOpen(false)
      choose(i)
    })
    li.append(button)
    stationList.append(li)
    return li
  })
}

function isWindowOpen(): boolean {
  return channelDrawer.classList.contains('is-open')
}

function setWindowOpen(open: boolean): void {
  channelDrawer.classList.toggle('is-open', open)
  channelToggle.setAttribute('aria-expanded', String(open))
  if (open) updateHighlights()
}

function toggleWindow(): void {
  setWindowOpen(!isWindowOpen())
}

// 현재 방송국 항목만 강조한다.
function updateHighlights(): void {
  listItems.forEach((li, i) => li.classList.toggle('is-active', i === index))
}

function renderStation(): void {
  stationName.textContent = currentStation().name
  needle.style.left = `${needleLeftPercent(currentStation().freq)}%`
  updateHighlights()
}

// 상태는 키로 들고 있어서 언어를 바꿔도 다시 그릴 수 있다.
let statusKey: Key = 'status.idle'
function setStatus(key: Key): void {
  statusKey = key
  statusText.textContent = t(key)
}

function changeLang(): void {
  cycleLang()
  applyI18n()
  statusText.textContent = t(statusKey)
}

function setPlayingUi(playing: boolean): void {
  radio.classList.toggle('is-playing', playing)
}

// 워커 요청. 실패하면 상태를 '오류'로 두고 원인은 console 에만 남긴다.
async function call(name: string, input?: unknown): Promise<unknown> {
  try {
    return await orca.plugin.request(name, input)
  } catch (error) {
    console.error(`radio: ${name} 실패`, error)
    setStatus('status.error')
    throw error
  }
}

// 재생을 시작할 때 슬라이더 값을 함께 보낸다. 워커가 mpv 에 적용한 실제 값을 돌려주면 슬라이더를 거기에 맞춘다.
async function play(): Promise<void> {
  wantPlaying = true
  playStartedAt = Date.now()
  setStatus('status.connecting')
  const reply = await call('play', { url: currentStation().url, volume: Number(volumeInput.value) }).catch(() => undefined)
  const volume = (reply as { volume: number | null } | undefined)?.volume
  if (typeof volume === 'number') volumeInput.value = String(volume)
}

function togglePlay(): void {
  if (wantPlaying) void stop()
  else void play()
}

function setVolume(value: number): void {
  volumeInput.value = String(value)
  void call('volume', { value }).catch(() => undefined)
}

async function stop(): Promise<void> {
  wantPlaying = false
  setPlayingUi(false)
  setStatus('status.stopped')
  await call('stop').catch(() => undefined)
}

// 이전/다음 조작. 재생 중이었다면 새 방송국을 바로 이어서 튼다 (워커가 이전 mpv 를 끝내고 새로 띄운다).
function selectStation(next: number): void {
  index = next
  renderStation()
  if (wantPlaying) void play()
}

// 채널 창에서 고른 방송국은 재생 여부와 상관없이 바로 튼다.
function choose(next: number): void {
  index = next
  renderStation()
  void play()
}

function move(delta: number): void {
  selectStation((index + delta + STATIONS.length) % STATIONS.length)
}

// 워커 상태를 화면에 반영한다. 재생 중 여부는 mpv 프로세스가 살아 있는지로만 판정한다.
async function refreshStatus(): Promise<void> {
  let status: PlayerStatus
  try {
    status = (await orca.plugin.request('status')) as PlayerStatus
  } catch {
    return
  }
  if (status.state === 'playing') {
    wantPlaying = true
    setPlayingUi(true)
    setStatus('status.playing')
    return
  }
  setPlayingUi(false)
  if (!wantPlaying) {
    setStatus('status.stopped')
    return
  }
  // 재생을 요청했는데 mpv 가 없다: 뜨는 중이면 기다리고, 시간이 지나면 오류로 본다.
  if (Date.now() - playStartedAt > START_GRACE_MS) {
    wantPlaying = false
    setStatus('status.error')
    console.error('radio: mpv 가 실행되지 않음', status.lastError)
  }
}

playButton.addEventListener('click', () => void play())
stopButton.addEventListener('click', () => void stop())
prevButton.addEventListener('click', () => move(-1))
nextButton.addEventListener('click', () => move(1))
channelToggle.addEventListener('click', toggleWindow)
volumeInput.addEventListener('input', () => {
  void call('volume', { value: Number(volumeInput.value) }).catch(() => undefined)
})
// 키보드: 입력 칸(볼륨 슬라이더 포함)에 포커스가 있으면 건드리지 않는다.
document.addEventListener('keydown', (event) => {
  const target = event.target as HTMLElement
  if (event.key === 'Escape' && isWindowOpen()) setWindowOpen(false)
  if (target.closest('input, textarea, select, [contenteditable]')) return
  switch (event.key) {
    case 'ArrowLeft': move(-1); break
    case 'ArrowRight': move(1); break
    case 'ArrowUp': setVolume(stepVolume(Number(volumeInput.value), KEY_VOLUME_STEP)); break
    case 'ArrowDown': setVolume(stepVolume(Number(volumeInput.value), -KEY_VOLUME_STEP)); break
    case ' ': togglePlay(); break
    case 'F2': changeLang(); break
    default: return
  }
  // 방향키의 페이지 스크롤, 포커스된 버튼의 Space 클릭과 겹치지 않게 막는다.
  event.preventDefault()
})
// 창과 토글 버튼 둘 다 밖을 누르면 닫는다. 창 안의 빈 곳 클릭은 닫지 않는다.
document.addEventListener('pointerdown', (event) => {
  const target = event.target as Node
  if (isWindowOpen() && !channelWindow.contains(target) && !channelToggle.contains(target)) setWindowOpen(false)
})

volumeInput.value = String(DEFAULT_VOLUME)
renderStationList()
renderStation()
applyI18n()
setStatus('status.idle')
setInterval(() => void refreshStatus(), POLL_MS)
