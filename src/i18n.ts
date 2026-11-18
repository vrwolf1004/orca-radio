// 패널 문자열. 언어는 브라우저 언어 앞 두 글자로 고르고, 없으면 영어다.
// 지원: en, ko, ja, de, es, fr, ru (herdr-tetris 와 같은 언어 구성). 키를 추가하면 모든 언어에 넣는다.
export const MESSAGES = {
  en: {
    'status.idle': 'Ready',
    'status.connecting': 'Connecting',
    'status.playing': 'Playing',
    'status.stopped': 'Stopped',
    'status.error': 'Error',
    'station.none': '-- No station --',
    'button.theme': 'Change design',
    'button.channel': 'Channel',
    'button.prev': 'Previous channel',
    'button.play': 'Play',
    'button.stop': 'Stop',
    'button.next': 'Next channel',
    'channel.list': 'Channel list',
    'help.title': 'Keyboard shortcuts',
    'help.move': '← → previous / next station',
    'help.play': 'Space play / stop',
    'help.volume': '↑ ↓ volume',
    'help.lang': 'F2 change language',
    'help.help': 'Ctrl+H show / hide this help',
    'help.close': 'Esc or click to close',
  },
  ko: {
    'status.idle': '대기 중',
    'status.connecting': '연결 중',
    'status.playing': '재생 중',
    'status.stopped': '정지',
    'status.error': '오류',
    'station.none': '-- 방송 없음 --',
    'button.theme': '디자인 바꾸기',
    'button.channel': '채널',
    'button.prev': '이전 채널',
    'button.play': '재생',
    'button.stop': '정지',
    'button.next': '다음 채널',
    'channel.list': '채널 목록',
    'help.title': '단축키',
    'help.move': '← → 이전 / 다음 방송',
    'help.play': 'Space 재생 / 정지',
    'help.volume': '↑ ↓ 볼륨',
    'help.lang': 'F2 언어 변경',
    'help.help': 'Ctrl+H 도움말 열기 / 닫기',
    'help.close': 'Esc 또는 클릭으로 닫기',
  },
  ja: {
    'status.idle': '待機中',
    'status.connecting': '接続中',
    'status.playing': '再生中',
    'status.stopped': '停止',
    'status.error': 'エラー',
    'station.none': '-- 放送なし --',
    'button.theme': 'デザインを変更',
    'button.channel': 'チャンネル',
    'button.prev': '前のチャンネル',
    'button.play': '再生',
    'button.stop': '停止',
    'button.next': '次のチャンネル',
    'channel.list': 'チャンネル一覧',
    'help.title': 'ショートカット',
    'help.move': '← → 前 / 次の放送',
    'help.play': 'Space 再生 / 停止',
    'help.volume': '↑ ↓ 音量',
    'help.lang': 'F2 言語変更',
    'help.help': 'Ctrl+H ヘルプの表示 / 非表示',
    'help.close': 'Esc またはクリックで閉じる',
  },
  de: {
    'status.idle': 'Bereit',
    'status.connecting': 'Verbinde',
    'status.playing': 'Wiedergabe',
    'status.stopped': 'Gestoppt',
    'status.error': 'Fehler',
    'station.none': '-- Kein Sender --',
    'button.theme': 'Design ändern',
    'button.channel': 'Kanal',
    'button.prev': 'Vorheriger Kanal',
    'button.play': 'Abspielen',
    'button.stop': 'Stopp',
    'button.next': 'Nächster Kanal',
    'channel.list': 'Kanalliste',
    'help.title': 'Tastenkürzel',
    'help.move': '← → vorheriger / nächster Sender',
    'help.play': 'Space abspielen / stoppen',
    'help.volume': '↑ ↓ Lautstärke',
    'help.lang': 'F2 Sprache ändern',
    'help.help': 'Strg+H Hilfe ein / aus',
    'help.close': 'Esc oder Klick zum Schließen',
  },
  es: {
    'status.idle': 'Listo',
    'status.connecting': 'Conectando',
    'status.playing': 'Reproduciendo',
    'status.stopped': 'Detenido',
    'status.error': 'Error',
    'station.none': '-- Sin emisora --',
    'button.theme': 'Cambiar diseño',
    'button.channel': 'Canal',
    'button.prev': 'Canal anterior',
    'button.play': 'Reproducir',
    'button.stop': 'Detener',
    'button.next': 'Canal siguiente',
    'channel.list': 'Lista de canales',
    'help.title': 'Atajos de teclado',
    'help.move': '← → emisora anterior / siguiente',
    'help.play': 'Space reproducir / detener',
    'help.volume': '↑ ↓ volumen',
    'help.lang': 'F2 cambiar idioma',
    'help.help': 'Ctrl+H mostrar / ocultar ayuda',
    'help.close': 'Esc o clic para cerrar',
  },
  fr: {
    'status.idle': 'Prêt',
    'status.connecting': 'Connexion',
    'status.playing': 'Lecture',
    'status.stopped': 'Arrêté',
    'status.error': 'Erreur',
    'station.none': '-- Aucune station --',
    'button.theme': 'Changer le design',
    'button.channel': 'Canal',
    'button.prev': 'Canal précédent',
    'button.play': 'Lecture',
    'button.stop': 'Arrêt',
    'button.next': 'Canal suivant',
    'channel.list': 'Liste des canaux',
    'help.title': 'Raccourcis clavier',
    'help.move': '← → station précédente / suivante',
    'help.play': 'Espace lecture / arrêt',
    'help.volume': '↑ ↓ volume',
    'help.lang': 'F2 changer de langue',
    'help.help': 'Ctrl+H afficher / masquer l’aide',
    'help.close': 'Échap ou clic pour fermer',
  },
  ru: {
    'status.idle': 'Готово',
    'status.connecting': 'Подключение',
    'status.playing': 'Воспроизведение',
    'status.stopped': 'Остановлено',
    'status.error': 'Ошибка',
    'station.none': '-- Нет станции --',
    'button.theme': 'Сменить дизайн',
    'button.channel': 'Канал',
    'button.prev': 'Предыдущий канал',
    'button.play': 'Играть',
    'button.stop': 'Стоп',
    'button.next': 'Следующий канал',
    'channel.list': 'Список каналов',
    'help.title': 'Горячие клавиши',
    'help.move': '← → предыдущая / следующая станция',
    'help.play': 'Space воспроизведение / стоп',
    'help.volume': '↑ ↓ громкость',
    'help.lang': 'F2 сменить язык',
    'help.help': 'Ctrl+H показать / скрыть справку',
    'help.close': 'Esc или клик, чтобы закрыть',
  },
} as const

export type Lang = keyof typeof MESSAGES
export type Key = keyof typeof MESSAGES.en

const LANGS = Object.keys(MESSAGES) as Lang[]

const LANG_KEY = 'orca-radio-lang'

// F2 로 고른 언어가 있으면 그것을, 없으면 브라우저 언어를 쓴다.
export function currentLang(): Lang {
  let saved: string | null = null
  try { saved = localStorage.getItem(LANG_KEY) } catch (e) { /* 저장소를 못 쓰면 브라우저 언어 */ }
  const code = (saved ?? navigator.language.slice(0, 2)).toLowerCase() as Lang
  return LANGS.includes(code) ? code : 'en'
}

// 다음 언어로 바꾸고 저장한다.
export function cycleLang(): Lang {
  const next = LANGS[(LANGS.indexOf(currentLang()) + 1) % LANGS.length]
  try { localStorage.setItem(LANG_KEY, next) } catch (e) { /* 저장 실패해도 이번 화면은 바뀐다 */ }
  return next
}

export function t(key: Key): string {
  return MESSAGES[currentLang()][key]
}

// data-i18n: 글자, data-i18n-title: 툴팁, data-i18n-aria: aria-label 을 바꾼다.
export function applyI18n(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n as Key)
  })
  root.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle as Key)
  })
  root.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria as Key))
  })
}
