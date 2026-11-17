// herdr-radio 방송 목록 (장르 순서대로 28개).
// 복사본: 원본은 C:/work/app/herdr-radio/src/genres.json. 원본이 바뀌면 이 파일을 다시 생성한다.
// freq 는 89.1~108.0 MHz 에 0.7 간격으로 임의 배치한 값이다 (실제 방송 주파수 아님).

export interface Station {
  name: string
  url: string
  freq: number // MHz
}

export const STATIONS: Station[] = [
  { name: "Radio Swiss Jazz", url: "http://stream.srg-ssr.ch/m/rsj/mp3_128", freq: 89.1 },
  { name: "Jazz Radio", url: "http://jazzradio.ice.infomaniak.ch/jazzradio-high.mp3", freq: 89.8 },
  { name: "Jazz Radio Blues", url: "http://jazzblues.ice.infomaniak.ch/jazzblues-high.mp3", freq: 90.5 },
  { name: "101 Smooth Jazz", url: "http://jking.cdnstream1.com/b22139_128mp3", freq: 91.2 },
  { name: "100 Greatest Jazz Lounge Bar", url: "https://cast1.torontocast.com:4640/stream", freq: 91.9 },
  { name: "Classic FM", url: "http://ice-the.musicradio.com/ClassicFMMP3", freq: 92.6 },
  { name: "Radio Swiss Classic", url: "http://stream.srg-ssr.ch/m/rsc_de/mp3_128", freq: 93.3 },
  { name: "BR-Klassik", url: "https://dispatcher.rndfnk.com/br/brklassik/live/mp3/high", freq: 94.0 },
  { name: "France Musique", url: "http://direct.francemusique.fr/live/francemusique-midfi.mp3", freq: 94.7 },
  { name: "Your Classical - Relax", url: "http://relax.stream.publicradio.org/relax.mp3", freq: 95.4 },
  { name: "Listen.moe Kpop", url: "https://listen.moe/kpop/fallback", freq: 96.1 },
  { name: "RauteMusik K-POP", url: "https://streams.rautemusik.fm/k-pop/mp3-192", freq: 96.8 },
  { name: "Only Hits K-Pop", url: "https://kpop.onlyhit.us/play", freq: 97.5 },
  { name: "SBS PopAsia", url: "https://sbs-ice.streamguys1.com/sbs-popasia-sbs-web", freq: 98.2 },
  { name: "REYFM #kpop", url: "https://listen.reyfm.de/kpop_320kbps.mp3", freq: 98.9 },
  { name: "Radio Paradise Rock Mix", url: "http://stream.radioparadise.com/rock-320", freq: 99.6 },
  { name: "Virgin Radio Classic Rock", url: "http://icy.unitedradio.it/VirginRockClassics.mp3", freq: 100.3 },
  { name: "181.FM - True Blues", url: "https://listen.181fm.com/181-blues_128k.mp3", freq: 101.0 },
  { name: "Ambient Sleeping Pill", url: "https://radio.stereoscenic.com/asp-h", freq: 101.7 },
  { name: "1.FM - Ambient Psychill", url: "http://strm112.1.fm/ambientpsy_mobile_mp3", freq: 102.4 },
  { name: "Antenne Bayern - Chillout", url: "http://mp3channels.webradio.antenne.de/chillout", freq: 103.1 },
  { name: "0N - Chillout", url: "https://0n-chillout.radionetz.de/0n-chillout.aac", freq: 103.8 },
  { name: "BBC World Service", url: "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service", freq: 104.5 },
  { name: "CNN", url: "https://tunein.cdnstream1.com/2868_96.mp3", freq: 105.2 },
  { name: "Arirang Radio", url: "http://amdlive-ch03-ctnd-com.akamaized.net/arirang_3ch/arirang_3ch_audio/chunklist_b128000.m3u8", freq: 105.9 },
  { name: "NHKワールド・ラジオ日本", url: "https://masterpl.hls.nhkworld.jp/hls/r1/live/master.m3u8", freq: 106.6 },
  { name: "RNE Radio Nacional", url: "https://rtvelivestream.rtve.es/rtvesec/rne/rne_r1_main.m3u8", freq: 107.3 },
  { name: "France Info", url: "http://icecast.radiofrance.fr/franceinfo-hifi.aac", freq: 108.0 }
]
