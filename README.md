# Orca Radio

Orca 플러그인. 현재는 기본 골격만 있다.

## 구조

- `orca-plugin.json` — 플러그인 매니페스트 (manifestVersion 2)

## 실행 프로필

매니페스트의 `execution` 은 필요한 권한의 최소 단위로 고른다.

- `data` — 테마, 번역 등 데이터만
- `declarative` — 명령, 단축키 (현재 설정)
- `sandboxed-ui` — 패널
- `trusted-worker` — `main` 모듈 (백그라운드 로직, 재생 등)

기능을 추가할 때 `contributes` 와 `capabilities` 를 채우고, 필요하면 `execution` 을 올린다.

## 다음 단계

1. 필요한 기능 정하기 (재생, 스테이션 목록, 패널 등)
2. 해당 실행 프로필로 `execution` 상향
3. Orca 에 로컬 플러그인으로 설치해 동작 확인
