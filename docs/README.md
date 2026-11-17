# Radio for Orca 문서

Orca 사이드바에서 인터넷 라디오를 듣는 플러그인입니다. 옛날 라디오 모양의 패널에서 방송국을 바꾸고 재생, 정지, 볼륨을 조절합니다.

## 문서 목록

- [architecture.md](architecture.md): 구성 요소, 실행 프로필, 파일 소유, 요소 id 계약
- [development.md](development.md): 로드, 승인, 캡처, 로그 등 개발 절차
- [design.md](design.md): 패널 디자인 방향과 화면 구성
- [stations.md](stations.md): 방송국 목록과 스트림 주소 관리

## 현재 상태

- 사이드바 패널(`radio`)이 Orca에 로드되고, 방송국 이름과 상태, 볼륨이 표시됩니다.
- 재생은 패널 안의 HTML `<audio>` 요소가 맡습니다. 외부 프로그램은 쓰지 않습니다.
- 실제 스트림 재생과 TypeScript 타입체크는 아직 확인하지 않았습니다.
