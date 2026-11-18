# Radio for Orca

[**English**](README.md) | 한국어

Orca 사이드바에서 인터넷 라디오를 듣는 플러그인입니다. 옛날 라디오 모양의 패널에서 주파수 눈금으로 방송을 고르고, 재생, 정지, 볼륨을 조절합니다.


## 화면

![패널 (재생 중)](docs/design-shots/screenshot-final.png?v=2)

| 디자인 A (황동) | 디자인 B (월넛) | 디자인 C (차콜) |
| --- | --- | --- |
| ![A](docs/design-shots/design-a-final.png?v=2) | ![B](docs/design-shots/design-b-final.png?v=2) | ![C](docs/design-shots/design-c-final.png?v=2) |

![채널 목록 펼침](docs/design-shots/channel-window.png?v=2)

## 기능

- **주파수 눈금**: 89.1 ~ 108.0 MHz 눈금에서 현재 방송의 위치를 바늘로 표시합니다.
- **CH 목록**: `CH` 버튼을 누르면 방송 목록이 열리고, 항목을 고르면 바로 재생합니다.
- **재생 조작**: 이전 채널, 재생, 정지, 다음 채널, 볼륨.
- **디자인 3종**: `T` 버튼으로 A(빈티지 황동, 기본), B(하이파이 월넛), C(레트로 차콜)를 바꿉니다. 고른 디자인은 기억합니다.
- **재생 표시**: 재생 중에는 눈금판이 살짝 깜빡이고, 그릴 옆 전원 표시등이 껌뻑입니다.
- **방송 목록**: 장르별 방송 28개가 들어 있습니다 (`src/stations.ts`).

## 요구 사항

- **Windows** 에서 테스트했습니다.
- **mpv** 가 설치되어 있어야 합니다. 워커는 `C:\Program Files\MPV Player\mpv.exe` 또는 `C:\Program Files\mpv\mpv.exe` 의 절대 경로만 씁니다. PATH 에서는 찾지 않으며, 둘 다 없으면 재생하지 않고 오류를 표시합니다.

## 알려진 제한

- 재생은 워커가 띄운 mpv 가 맡습니다. 패널의 `<audio>` 는 Orca 샌드박스에서 외부 스트림이 차단되어 쓰지 않습니다.
- 일부 방송 주소는 막혀 있을 수 있습니다. 재생 여부는 방송마다 다릅니다.
- 주파수는 임의 배치입니다. 실제 방송 주파수가 아닙니다.
- 워커가 비정상 종료하면 mpv 가 남을 수 있습니다.

## 라이선스

MIT. [LICENSE](LICENSE) 를 보세요.

## 프로젝트 후원

이 프로젝트가 도움이 되었다면 개발자에게 커피 한 잔 후원을 고려해 주세요.

[![Support on Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=for-the-badge&logo=buymeacoffee&logoColor=white)](https://ko-fi.com/dev_ohyt)
