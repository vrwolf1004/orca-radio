// 재생 워커 (trusted-worker). 이 플러그인이 띄운 mpv 한 개만 다룬다.
// herdr-radio 의 mpv 는 제목·IPC 파이프가 달라 건드리지 않는다. 기존 mpv 를 죽이지 않는다.
import { spawn, type ChildProcess } from 'node:child_process'
import { existsSync } from 'node:fs'
import { createConnection } from 'node:net'

// 패널이 보내는 요청 이름 (src/panel.ts 의 orca.plugin.request 와 맞춘다).
type Handler = (input: any) => unknown
type Orca = {
  log(message: string): void
  panels: { handle(name: string, handler: Handler): { dispose(): void } }
}

const MPV_CANDIDATES = ['C:\\Program Files\\MPV Player\\mpv.exe', 'C:\\Program Files\\mpv\\mpv.exe']
const PIPE = '\\\\.\\pipe\\orca-radio-mpv'

let player: ChildProcess | null = null
let lastError: string | null = null
// 요청을 한 번에 하나씩 처리한다 (play 와 stop 이 겹쳐 mpv 가 둘 뜨지 않게).
let queue: Promise<unknown> = Promise.resolve()

function serial<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task)
  queue = run.catch(() => undefined)
  return run
}

// PATH 의 mpv 는 쓰지 않는다 (cwd 등 신뢰하지 않는 위치의 실행 파일을 띄울 수 있다). 절대 경로만 쓴다.
function mpvPath(): string | null {
  return MPV_CANDIDATES.find((path) => existsSync(path)) ?? null
}

function running(): boolean {
  return player !== null && player.exitCode === null && player.signalCode === null
}

// 이 워커가 띄운 mpv 만 끝낸다. 끝난 뒤에 resolve 한다 (같은 IPC 파이프 이름을 다시 쓰려면 먼저 끝나야 한다).
function killPlayer(): Promise<void> {
  const child = player
  if (!child || !running()) {
    player = null
    return Promise.resolve()
  }
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

async function play(url: string): Promise<void> {
  await killPlayer()
  lastError = null
  const exe = mpvPath()
  if (!exe) {
    lastError = 'mpv 를 찾지 못했습니다. ' + MPV_CANDIDATES[0] + ' 에 설치하세요.'
    throw Object.assign(new Error(lastError), { code: 'mpv_not_found' })
  }
  const child = spawn(
    exe,
    ['--no-video', '--no-terminal', '--really-quiet', '--network-timeout=5', '--title=orca-radio', `--input-ipc-server=${PIPE}`, url],
    { detached: true, stdio: 'ignore', windowsHide: true }
  )
  player = child
  child.on('error', (error) => {
    lastError = String(error)
    if (player === child) player = null
  })
  child.once('exit', () => {
    if (player === child) player = null
  })
  child.unref()
}

// 볼륨 등 mpv 명령은 IPC 파이프로 보낸다. 실패해도 재생은 그대로 둔다.
function sendIpc(command: unknown[]): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = createConnection(PIPE)
    socket.once('connect', () => {
      socket.end(`${JSON.stringify({ command })}\n`)
      resolve(true)
    })
    socket.once('error', () => resolve(false))
  })
}

function validUrl(value: unknown): string {
  if (typeof value === 'string' && /^https?:\/\//.test(value)) return value
  throw Object.assign(new Error('url must be an http or https address'), { code: 'invalid_params' })
}

export default function activate(orca: Orca): void {
  orca.panels.handle('play', (input) => serial(() => play(validUrl(input?.url))))
  orca.panels.handle('stop', () => serial(killPlayer))
  orca.panels.handle('volume', (input) => {
    const value = Number(input?.value)
    if (!Number.isFinite(value) || value < 0 || value > 1) {
      throw Object.assign(new Error('volume must be between 0 and 1'), { code: 'invalid_params' })
    }
    return sendIpc(['set_property', 'volume', Math.round(value * 100)])
  })
  orca.panels.handle('status', () => ({
    state: running() ? 'playing' : 'stopped',
    pid: running() ? (player?.pid ?? null) : null,
    lastError
  }))
  orca.log('radio worker ready')
}

// Orca 가 워커를 멈추기 전에 기다린다. 이 워커가 띄운 mpv 만 끝낸다.
export async function deactivate(): Promise<void> {
  await serial(killPlayer)
}
