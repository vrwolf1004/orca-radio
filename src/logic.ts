// 순수 계산과 입력 검증. 패널(src/panel.ts)과 워커(src/worker.ts)가 함께 쓰고, tests/logic.test.ts 로 검증한다.

export const FREQ_MIN = 89.1
export const FREQ_MAX = 108.0

// 바늘 위치(%): 주파수를 눈금 범위(FREQ_MIN~FREQ_MAX)의 비율로 놓는다.
export function needleLeftPercent(freq: number): number {
  return ((freq - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)) * 100
}

// 신뢰 경계: 패널에서 온 값은 http(s) 주소만 통과시킨다. 아니면 null.
export function validUrl(value: unknown): string | null {
  return typeof value === 'string' && /^https?:\/\//.test(value) ? value : null
}

// 0~1 사이 숫자만 통과. 문자열이나 범위 밖은 null.
export function validVolume(value: unknown): number | null {
  return typeof value === 'number' && value >= 0 && value <= 1 ? value : null
}

// 키보드 볼륨 조절: 0~1 범위에 맞추고 부동소수 오차를 0.01 단위로 정리한다.
export function stepVolume(current: number, delta: number): number {
  return Math.min(1, Math.max(0, Math.round((current + delta) * 100) / 100))
}
