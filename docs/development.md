# 개발 절차

모든 명령은 Orca CLI로 실행합니다. 경로는 환경에 맞게 바꿉니다.

```text
ORCA="C:\Users\PC\AppData\Local\Programs\orca\resources\bin\orca.exe"
```

## 1. 매니페스트 검증

```text
"$ORCA" plugin validate .
```

`orca-plugin.json`과 파일 구조가 맞는지 확인합니다. 실패하면 종료 코드 2를 돌려줍니다.

## 2. 개발 폴더 로드

```text
"$ORCA" plugin dev load .
```

처음 로드하면 승인이 필요하다는 메시지와 지문(`ap1-...`)이 나옵니다. 이 명령에 `--approve <지문>`을 붙여 다시 실행합니다.

- 승인은 플러그인 버전, 파일 내용, 권한에 묶입니다. 파일을 바꾸면 지문이 바뀌어 다시 승인해야 합니다.
- 권한(패널) 범위를 넓히면 새 승인이 필요합니다.
- 승인된 상태에서 코드만 고치면 Orca가 자동으로 다시 불러옵니다.

## 3. 패널 캡처

```text
"$ORCA" plugin shot <플러그인 키> --panel radio --out <png 경로>
```

Orca가 그린 그대로 PNG를 저장합니다. 디자인 확인에 쓰고, 기능 동작(재생 등)은 이 캡처로 알 수 없습니다.

## 4. 로그 확인

```text
"$ORCA" plugin logs <플러그인 키>
```

## 5. 개발 폴더 제거

```text
"$ORCA" plugin dev unload .
```

## 확인 상태

| 항목 | 상태 |
| --- | --- |
| 매니페스트 검증 | 통과 |
| 개발 폴더 로드, 패널 캡처 | 확인 |
| 방송국 스트림 재생 | 미확인 |
| TypeScript 타입체크 | 미확인 (tsc 미설치) |
