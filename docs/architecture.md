# 구조

## 구성 요소

```text
orca-plugin.json   매니페스트 (execution: trusted-worker, 패널 radio, main: src/worker.ts)
panel/index.html   패널 화면 (디자인 담당: chef)
panel/style.css    패널 스타일 (기본 A 디자인, 버튼, 램프, 도움말, 서랍)
panel/themes/      디자인 B, C 스타일 (style.css 뒤에 덮어씀)
panel/theme.js     T 버튼: 디자인 A/B/C 순환과 저장
src/panel.ts       패널 로직: 주파수, 채널, 버튼, 키보드, 상태 (core 담당: dev)
src/worker.ts      재생 워커: mpv 실행, 정지, 볼륨, 상태 조회
src/logic.ts       순수 계산과 입력 검증 (바늘 위치, URL, 볼륨)
src/i18n.ts        7개 언어 문자열, 언어 선택, 화면 문자열 적용
src/stations.ts    방송 목록 (이름, 스트림 주소, 주파수)
tests/             단위 테스트 (logic, i18n)
```

재생 흐름은 다음과 같습니다.

```text
사용자 클릭/키 → src/panel.ts → plugin.request → src/worker.ts → mpv (--title=orca-radio)
                     ↑                                  ↓
          상태 조회(1초마다) ←───────────────────── mpv IPC (볼륨, 상태)
```

패널은 `<audio>`를 쓰지 않습니다. Orca 샌드박스가 외부 스트림을 막기 때문입니다.

## 실행 프로필

`trusted-worker`입니다. 패널(`sandboxed-ui`)은 UI만 그리고, 재생은 워커가 맡습니다. 워커는 사용자 권한으로 mpv 를 실행하므로 설치할 때 전체 권한 승인이 필요합니다.

## 파일 소유

- **core (dev)**: `src/`, `orca-plugin.json`, `tests/`
- **디자인 (chef)**: `panel/`, `docs/`

## 워커 규칙

- 재생 전과 정지 때 `--title=orca-radio` 가 붙은 mpv 를 모두 끝냅니다. pid 파일은 쓰지 않습니다.
- 재생 명령은 한 번에 하나만 처리합니다(`serial`).
- 볼륨은 재생 시작 때 패널 슬라이더 값을 보내고, 워커가 mpv 의 실제 값을 돌려줍니다.
- 워커 입력(URL, 볼륨)은 `src/logic.ts` 에서 검증합니다. 잘못된 값은 `invalid_params` 로 거부합니다.

## 요소 id 계약

`src/panel.ts`가 `panel/index.html`의 다음 id를 찾습니다. 하나라도 바뀌면 양쪽을 같이 고칩니다.

| id | 요소 | 역할 |
| --- | --- | --- |
| `theme-toggle` | button (T) | 디자인 A → B → C 순환 |
| `channel-toggle` | button (CH) | 채널 서랍 열기 / 닫기 |
| `channel-drawer` | div | 채널 서랍. 열림은 `.is-open` 클래스 |
| `channel-window` | section | 서랍 안의 채널 창 |
| `station-list` | ul | 방송마다 li > button (이름, 주파수). 현재 방송은 `.is-active` |
| `prev`, `play`, `stop`, `next` | button | 이전 채널, 재생, 정지, 다음 채널 (Lucide 아이콘 SVG) |
| `volume` | input range | 볼륨 (0~1, 기본 0.8). 키보드는 0.05 단위 |
| `station-name` | div | 현재 방송 이름 (없으면 "-- 방송 없음 --") |
| `status` | div (화면에서 숨김) | 상태 문구. 화면 낭독기용 `aria-live` |
| `help` | div | 도움말 팝업 (Ctrl+H) |

data 속성으로 번역을 표시합니다.

- `data-i18n`: 글자
- `data-i18n-title`: 툴팁
- `data-i18n-aria`: `aria-label`

## 디자인 연동 계약

- `.radio` 에 `is-playing` 클래스: 재생 중에만 붙습니다. 바늘 발광, 눈금판 깜빡임, ON AIR 램프, PLAY 버튼 앰버 빛을 켭니다.
- `.needle` 의 `style.left`: 방송 주파수 위치(%)입니다. CSS transition 으로 움직입니다.
- `#channel-drawer.is-open`: 채널 서랍을 펼칩니다. 닫힘은 높이 0에 창이 위로 가려진 상태입니다.

## 진입 방식

`panel/index.html`이 `<script type="module" src="../src/panel.ts">`로 TypeScript 파일을 직접 불러옵니다. 별도 빌드는 없습니다. Orca가 로드할 때 `.ts`를 변환합니다.
