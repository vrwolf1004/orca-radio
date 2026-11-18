# Radio for Orca 문서

Orca 사이드바에서 인터넷 라디오를 듣는 플러그인입니다. 옛날 라디오 모양의 패널에서 방송을 고르고, 재생, 정지, 볼륨을 조절합니다.

## 문서 목록

- [architecture.md](architecture.md): 구성 요소, 재생 흐름, 워커 규칙, 요소 id 계약
- [development.md](development.md): 테스트, 로드, 승인, 캡처, 재생 확인 절차
- [design.md](design.md): 화면 구성, 상태 표시, 버튼, 디자인 A·B·C
- [stations.md](stations.md): 방송 목록과 스트림 주소 확인 기록
- [todo.md](todo.md): 남은 개선 작업

## 현재 상태 한눈에

- 재생은 워커가 띄운 mpv가 맡습니다. 패널의 `<audio>`는 Orca 샌드박스에서 막혀 쓰지 않습니다.
- 채널 서랍, 도움말(Ctrl+H), 언어 7개(F2로 변경), 디자인 A·B·C(T 버튼), ON AIR 램프, 키보드 조작이 있습니다.
- 정지와 재생 때 orca-radio mpv를 모두 끝냅니다. herdr-radio의 mpv는 건드리지 않습니다.
- 단위 테스트(logic, i18n)와 매니페스트 검증은 통과합니다.
- 실제 재생 소리, 서랍 펼침, 키보드 조작은 사람이 직접 확인해야 합니다.
