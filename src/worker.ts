// 재생 워커 (trusted-worker). 이 플러그인이 띄운 mpv 한 개만 다룬다.
// herdr-radio 의 mpv 는 제목·IPC 파이프가 달라 건드리지 않는다. 기존 mpv 를 죽이지 않는다.
import { execFile, spawn, type ChildProcess } from 'node:child_process'
import { existsSync } from 'node:fs'
import { createConnection } from 'node:net'
import { validUrl, validVolume } from './logic'

// 패널이 보내는 요청 이름 (src/panel.ts 의 orca.plugin.request 와 맞춘다).
type Handler = (input: any) => unknown
type Orca = {
  log(message: string): void
  panels: { handle(name: string, handler: Handler): { dispose(): void } }
}

const MPV_CANDIDATES = ['C:\\Program Files\\MPV Player\\mpv.exe', 'C:\\Program Files\\mpv\\mpv.exe']
const PIPE = '\\\\.\\pipe\\orca-radio-mpv'
const TITLE_ARG = '--title=orca-radio'

let player: ChildProcess | null = null
let lastError: string | null = null
let mpvVolume: number | null = null
// 요청을 한 번에 하나씩 처리한다 (play 와 stop 이 겹쳐 mpv 가 둘 뜨지 않게).
let queue: Promise<unknown> = Promise.resolve()

function serial<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task)
  queue = run.catch(() => undefined)
  return run
}

function invalid(message: string): Error {
  return Object.assign(new Error(message), { code: 'invalid_params' })
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// PATH 의 mpv 는 쓰지 않는다 (cwd 등 신뢰하지 않는 위치의 실행 파일을 띄울 수 있다). 절대 경로만 쓴다.
function mpvPath(): string | null {
  return MPV_CANDIDATES.find((path) => existsSync(path)) ?? null
}

function running(): boolean {
  return player !== null && player.exitCode === null && player.signalCode === null
}

// 이 워커가 띄운 mpv 만 끝낸다. 끝난 뒤에 resolve 한다 (같은 IPC 파이프 이름을 다시 쓰려면 먼저 끝나야 한다).
function killTracked(): Promise<void> {
  const child = player
  player = null
  mpvVolume = null
    if (!child || !running()) return Promise.resolve()
  return new Promise((resolve) => {
    child.once('exit', () => resolve())
    if (process.platform === 'win32') {
      // /T 로 mpv 의 자식 프로세스까지 함께 끝낸다.
      spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' }).unref()
    } else {
      child.kill()
    }
  })
}

// mpv IPC 명령 한 번. 응답 한 줄({"error":"success","data":...})을 받는다. 파이프가 없으면 reject.
function ipc(command: unknown[]): Promise<{ error: string; data?: unknown }> {
  return new Promise((resolve, reject) => {
    const socket = createConnection(PIPE)
    let buffer = ''
    socket.once('connect', () => socket.write(`${JSON.stringify({ command })}\n`))
    socket.on('data', (chunk) => {
      buffer += chunk.toString()
      const end = buffer.indexOf('\n')
      if (end < 0) return
      socket.end()
      try {
        resolve(JSON.parse(buffer.slice(0, end)))
      } catch (error) {
        reject(error)
      }
    })
    socket.once('error', reject)
    socket.once('close', () => reject(new Error('ipc closed before reply')))
  })
}

// mpv 가 파이프를 여는 데 시간이 걸리므로 몇 번 다시 시도한다. 플레이어가 죽으면 그만둔다.
async function syncVolume(value: number): Promise<void> {
  for (let attempt = 0; attempt < 20 && running(); attempt++) {
    try {
      await ipc(['set_property', 'volume', Math.round(value * 100)])
      const reply = await ipc(['get_property', 'volume'])
      if (reply.error === 'success' && typeof reply.data === 'number') {
        mpvVolume = reply.data / 100
        return
      }
      lastError = `mpv 볼륨 확인 실패: ${reply.error}`
      return
    } catch {
      await sleep(150)
    }
  }
  if (running()) lastError = 'mpv IPC 연결 실패 (볼륨을 맞추지 못함)'
}

async function play(url: string, volume: number): Promise<{ volume: number | null }> {
  await killPlayer()
  lastError = null
  const exe = mpvPath()
  if (!exe) {
    lastError = 'mpv 를 찾지 못했습니다. ' + MPV_CANDIDATES[0] + ' 에 설치하세요.'
    throw Object.assign(new Error(lastError), { code: 'mpv_not_found' })
  }
  const child = spawn(
    exe,
    ['--no-video', '--no-terminal', '--really-quiet', '--network-timeout=5', TITLE_ARG, `--input-ipc-server=${PIPE}`, url],
    { detached: true, stdio: 'ignore', windowsHide: true }
  )
  player = child
  child.on('error', (error) => {
    lastError = String(error)
    if (player === child) player = null
  })
  child.once('exit', () => {
    if (player !== child) return
    player = null
      })
  child.unref()
  await syncVolume(volume)
  return { volume: mpvVolume }
}

// 이 플러그인의 mpv 를 모두 끝낸다 (pid 파일에 의존하지 않는다). 제목 --title=orca-radio 로만 고르므로 herdr-radio 의 mpv 는 건드리지 않는다.
// 멈출 때는 이 워커가 기억하는 mpv 와, 워커가 바뀌면서 남은 같은 제목의 mpv 를 모두 끝낸다.
async function killPlayer(): Promise<void> {
  await killTracked()
  await killAllOrcaMpv()
}

function killAllOrcaMpv(): Promise<void> {
  if (process.platform !== 'win32') return Promise.resolve()
  const script = `Get-CimInstance Win32_Process -Filter "Name='mpv.exe'" | Where-Object { $_.CommandLine -like '*${TITLE_ARG}*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }`
  return new Promise((resolve) => {
    execFile('powershell', ['-NoProfile', '-Command', script], { windowsHide: true }, () => resolve())
  })
}

export default function activate(orca: Orca): void {
  serial(killAllOrcaMpv).catch(() => undefined)
  orca.panels.handle('play', (input) => {
    const url = validUrl(input?.url)
    const volume = validVolume(input?.volume)
    if (url === null) throw invalid('url must be an http or https address')
    if (volume === null) throw invalid('volume must be a number between 0 and 1')
    return serial(() => play(url, volume))
  })
  orca.panels.handle('stop', () => serial(killPlayer))
  orca.panels.handle('volume', (input) => {
    const value = validVolume(input?.value)
    if (value === null) throw invalid('volume must be a number between 0 and 1')
    return serial(async () => {
      if (!running()) return false
      await syncVolume(value)
      return mpvVolume !== null
    })
  })
  orca.panels.handle('status', () => ({
    state: running() ? 'playing' : 'stopped',
    pid: running() ? (player?.pid ?? null) : null,
    volume: mpvVolume,
    lastError
  }))
  orca.log('radio worker ready')
}

// Orca 가 워커를 멈추기 전에 기다린다. 이 워커가 띄운 mpv 만 끝낸다.
export async function deactivate(): Promise<void> {
  await serial(killPlayer)
}
