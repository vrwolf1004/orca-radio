# 방송국

현재 방송 목록은 `src/stations.ts`의 `STATIONS` 배열에 있습니다(herdr-radio 장르 목록 28개를 복사). 아래 표는 처음 확인한 3개 방송의 기록입니다.

| 이름 | 스트림 주소 | 형식 | 확인 날짜와 결과 |
| --- | --- | --- | --- |
| SomaFM Groove Salad | https://ice1.somafm.com/groovesalad-128-mp3 | MP3 128k | 2026-11-17: HTTP 403 (text/html). 공식 pls 주소 https://ice6.somafm.com/groovesalad-128-mp3 도 403 |
| SomaFM Lush | https://ice1.somafm.com/lush-128-mp3 | MP3 128k | 2026-11-17: HTTP 403 (text/html). 공식 pls 주소 https://ice6.somafm.com/lush-128-mp3 도 403 |
| Jazz Radio Blues | http://jazzblues.ice.infomaniak.ch/jazzblues-high.mp3 | MP3 (high) | 2026-11-17: HTTP 200, Content-Type audio/mpeg, icy-name JZR BLUES (Icy-MetaData: 0). 주소가 http 임 |

## 주의

- 스트림 주소는 방송사가 바꾸거나 끊을 수 있습니다. 재생이 안 되면 주소부터 확인합니다.
- 2026-11-17 확인: 두 방송국 모두 ice1 과 공식 pls 의 ice6 주소 모두 curl 에서 403 을 받았습니다(User-Agent 와 Icy-MetaData 헤더를 바꿔도 동일). 두 호스트가 모두 막혀 있어 호스트 차단으로는 설명되지 않습니다. 개발 PC 네트워크 제한이나 curl 요청 조건 때문일 수 있으며 아직 구분하지 못했습니다. 그래서 주소는 바꾸지 않았습니다. 브라우저(Orca 패널의 `<audio>`)에서 재생되는지가 최종 판단 기준입니다.
- 사용자가 방송국을 추가하거나 바꾸는 기능은 없습니다. 필요해지면 저장소(storage)로 옮깁니다.
- Jazz Radio Blues 는 http 주소입니다. https 로 열린 패널에서는 브라우저가 혼합 콘텐츠로 막을 수 있습니다(재생 실패 시 상태는 '오류'). 막히면 https 주소를 찾거나 이 방송국을 뺍니다. 실제로 막히는지는 Orca 패널에서 재생해 봐야 확인됩니다.
