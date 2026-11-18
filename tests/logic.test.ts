// 실행: node --test tests/logic.test.ts  (Node 24 의 타입 제거 기능 사용, 빌드 없음)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { FREQ_MAX, FREQ_MIN, needleLeftPercent, stepVolume, validUrl, validVolume } from '../src/logic.ts'
import { STATIONS } from '../src/stations.ts'

test('바늘: 눈금 양 끝과 가운데', () => {
  assert.equal(needleLeftPercent(FREQ_MIN), 0)
  assert.equal(needleLeftPercent(FREQ_MAX), 100)
  assert.ok(Math.abs(needleLeftPercent((FREQ_MIN + FREQ_MAX) / 2) - 50) < 1e-9)
})

test('바늘: 방송 주파수는 모두 눈금 안', () => {
  for (const s of STATIONS) {
    const left = needleLeftPercent(s.freq)
    assert.ok(left >= 0 && left <= 100, `${s.name} ${left}`)
  }
})

test('url: http(s) 만 통과, 그 밖은 invalid', () => {
  assert.equal(validUrl('https://example.com/a.mp3'), 'https://example.com/a.mp3')
  assert.equal(validUrl('http://example.com/a.mp3'), 'http://example.com/a.mp3')
  assert.equal(validUrl('ftp://example.com/a'), null)
  assert.equal(validUrl('file:///C:/x.mp3'), null)
  assert.equal(validUrl(''), null)
  assert.equal(validUrl(undefined), null)
  assert.equal(validUrl(42), null)
})

test('volume: 0~1 숫자만 통과, 문자열과 범위 밖은 invalid', () => {
  assert.equal(validVolume(0), 0)
  assert.equal(validVolume(1), 1)
  assert.equal(validVolume(0.5), 0.5)
  assert.equal(validVolume(-0.01), null)
  assert.equal(validVolume(1.01), null)
  assert.equal(validVolume('0.5'), null)
  assert.equal(validVolume(null), null)
  assert.equal(validVolume(undefined), null)
  assert.equal(validVolume(NaN), null)
})

test('키보드 볼륨: 0.05 단위로 움직이고 0~1 에서 멈춘다', () => {
  assert.equal(stepVolume(0.8, 0.05), 0.85)
  assert.equal(stepVolume(0.8, -0.05), 0.75)
  assert.equal(stepVolume(0.98, 0.05), 1)
  assert.equal(stepVolume(0.02, -0.05), 0)
  assert.equal(stepVolume(0.1, 0.05), 0.15)
})

test('방송 목록: 이름, http(s) 주소, 주파수 범위, 개수 28', () => {
  assert.equal(STATIONS.length, 28)
  for (const s of STATIONS) {
    assert.ok(s.name.trim().length > 0, 'name')
    assert.ok(/^https?:\/\//.test(s.url), `url ${s.url}`)
    assert.ok(s.freq >= FREQ_MIN && s.freq <= FREQ_MAX, `freq ${s.freq}`)
  }
})
