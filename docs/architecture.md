# 구조

## 구성 요소

```text
orca-plugin.json   매니페스트 (execution: sandboxed-ui, 패널 'radio' 등록)
panel/index.html   패널 화면 (디자인 담당: chef)
panel/style.css    패널 스타일 (디자인 담당: chef)
src/panel.ts       패널 로직 (core 담당: dev)
```

재생 흐름은 다음과 같습니다.

```text
사용자 클릭 → src/panel.ts → <audio id="audio"> → 인터넷 스트림
                          ↘ 상태/방송국 이름 갱신 (#status, #station-name)
```

외부 프로세스(mpv 등)는 쓰지 않습니다. 재생이 패널 안에서 끝나므로 패널을 닫으면 재생도 멈출 것으로 예상합니다. 이 동작은 아직 확인하지 않았습니다.

## 실행 프로필

`execution` 은 플러그인이 가질 수 있는 권한의 최소 단위입니다. 현재는 `sandboxed-ui`(패널)만 씁니다.

| 프로필 | 쓰는 이유 | 현재 사용 |
| --- | --- | --- |
| `data` | 테마, 번역 등 데이터 | 아니요 |
| `declarative` | 명령, 단축키 | 아니요 |
| `sandboxed-ui` | 패널 | 예 |
| `trusted-worker` | `main` 백그라운드 로직 | 아니요 (필요해지면 검토) |

오디오 재생 권한은 확인된 capability 목록에 없습니다. 그래서 현재 구조는 `<audio>` 요소에만 의존합니다.

## 파일 소유

같은 폴더를 두 담당자가 나눠 쓰므로 파일 소유를 고정합니다.

- **core (dev)**: `orca-plugin.json`, `src/panel.ts`, 빌드/설정 파일
- **디자인 (chef)**: `panel/index.html`, `panel/style.css`, `docs/`

양쪽 파일을 고칠 필요가 있으면 먼저 상대에게 알립니다.

## 요소 id 계약

`src/panel.ts`가 `panel/index.html`의 다음 id를 찾습니다. 하나라도 바뀌면 양쪽을 같이 고칩니다.

| id | 요소 | 역할 |
| --- | --- | --- |
| `play` | button | 재생 |
| `stop` | button | 정지 |
| `prev` | button | 이전 방송국 |
| `next` | button | 다음 방송국 |
| `volume` | input range | 볼륨 (0~1, step 0.01, 기본 0.8) |
| `station-name` | element | 방송국 이름 |
| `status` | element | 상태 문구 |
| `audio` | audio | 실제 재생 요소 |
| `channels` | div | 채널 줄. dev 가 방송국마다 `.channel` 을 만들고 현재 것에 `.is-active` |

볼륨 슬라이더는 `audio.volume`과 같은 0~1 범위입니다. 0~100으로 바꾸면 `audio.volume` 설정이 실패하므로 바꾸지 않습니다.

## 진입 방식

`panel/index.html`이 `<script type="module" src="../src/panel.ts">`로 TypeScript 파일을 직접 불러옵니다. 별도 빌드 단계는 없습니다. Orca가 로드할 때 `.ts`를 변환합니다.

## 추가 계약 (디자인 연동)

- `.radio` 에 `is-playing` 클래스: 재생 중에만 붙인다. 바늘 발광과 상태 글자 깜빡임을 켠다.
- `.needle` 의 `style.left`: 방송국 위치(%)로 설정한다. 바늘은 CSS transition 으로 움직인다.
- `#channels` 안의 `.channel`: 방송국마다 하나, 현재 방송국만 `.is-active`. 클릭으로 방송국을 고를 수 있다.
