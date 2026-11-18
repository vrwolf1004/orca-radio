import { test } from 'node:test'
import assert from 'node:assert/strict'
import { MESSAGES } from '../src/i18n.ts'

test('모든 언어가 영어와 같은 키를 가진다 (빠진 번역이 없다)', () => {
  const keys = Object.keys(MESSAGES.en).sort()
  for (const [lang, table] of Object.entries(MESSAGES)) {
    assert.deepEqual(Object.keys(table).sort(), keys, `${lang} 키가 다르다`)
  }
})

test('빈 번역 문자열이 없다', () => {
  for (const [lang, table] of Object.entries(MESSAGES)) {
    for (const [key, text] of Object.entries(table)) {
      assert.ok(text.trim().length > 0, `${lang}.${key} 가 비어 있다`)
    }
  }
})
