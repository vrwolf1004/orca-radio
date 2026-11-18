# 개발 절차

모든 명령은 Orca CLI로 실행합니다. 경로는 환경에 맞게 바꿉니다.

```text
ORCA="C:\Users\PC\AppData\Local\Programs\orca\resources\bin\orca.exe"
```

## 1. 테스트

```text
node --test tests/logic.test.ts tests/i18n.test.ts
```

`logic`(바늘, 주소, 볼륨)과 `i18n`(언어 키가 모두 같은지, 빈 번역이 없는지)을 확인합니다.

## 2. 매니페스트 검증

```text
"$ORCA" plugin validate .
```

`orca-plugin.json`과 파일 구조, 이미지 크기 기준을 확인합니다.

## 3. 개발 폴더 로드

```text
"$ORCA" plugin dev load .
```

처음 불러오면 승인 지문(`ap1-...`)이 나옵니다. `--approve <지문>`을 붙여 다시 실행합니다. 파일을 바꾸면 지문이 바뀌므로 다시 승인합니다.

워커가 재시작되면 그때 떠 있던 orca-radio mpv 가 같이 종료됩니다. 재생 확인 전에 이 점을 기억하세요.

## 4. 패널 캡처

```text
"$ORCA" plugin shot local.radio-for-orca --panel radio --out <png 경로>
```

Orca가 그린 그대로 PNG를 저장합니다. 화면 확인에 쓰고, 재생이나 소리는 캡처로 알 수 없습니다.

## 5. 로그와 상태

```text
"$ORCA" plugin logs local.radio-for-orca
"$ORCA" plugin dev request local.radio-for-orca status
```

`status` 는 워커의 재생 상태(`playing` 또는 `stopped`), mpv pid, 볼륨을 돌려줍니다.

## 6. 재생 확인 (사람)

1. 패널에서 CH 를 열고 방송을 고릅니다. 소리가 나는지 듣습니다.
2. 정지를 누르고 소리가 멈추는지 확인합니다.
3. 필요하면 mpv 프로세스를 확인합니다. `--title=orca-radio` 가 붙은 프로세스가 0개여야 합니다.

## 7. 개발 폴더 제거

```text
"$ORCA" plugin dev unload .
```

## 확인 상태

| 항목 | 상태 |
| --- | --- |
| 단위 테스트 (logic, i18n) | 통과 |
| 매니페스트 검증 | 통과 |
| 개발 폴더 로드, 패널 캡처 | 확인 |
| 워커 정지와 mpv 정리 (상태 조회로 확인) | 확인 |
| 재생 소리, 채널 서랍 펼침, 키보드 조작 | 사람이 직접 확인 필요 |
