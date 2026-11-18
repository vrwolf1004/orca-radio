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
  },
} as const

export type Lang = keyof typeof MESSAGES
export type Key = keyof typeof MESSAGES.en

const LANGS = Object.keys(MESSAGES) as Lang[]

export function currentLang(): Lang {
  const code = navigator.language.toLowerCase().slice(0, 2) as Lang
  return LANGS.includes(code) ? code : 'en'
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
