# Orca Radio

English | [**한국어**](README.ko.md)

An Orca plugin for listening to internet radio from the sidebar. The panel looks like an old radio: pick a station on a frequency dial, then play, stop, and adjust the volume.

## Features

- **Frequency dial**: a needle shows the current station's position on a 89.1–108.0 MHz scale.
- **CH list**: press `CH` to open the station list; choose an entry to start playing it.
- **Playback controls**: previous channel, play, stop, next channel, volume.
- **Three designs**: press `T` to switch between A (vintage brass, default), B (hi-fi walnut), and C (retro charcoal). The choice is remembered.
- **Playing indicators**: while playing, the dial glows faintly and the power lamp on the grille blinks.
- **Station list**: 28 stations across 6 genres (`src/stations.ts`).

## Requirements

- Tested on **Windows**.
- **mpv** must be installed. The worker uses only the absolute paths `C:\Program Files\MPV Player\mpv.exe` or `C:\Program Files\mpv\mpv.exe`. It does not search PATH. If neither exists, playback is refused and an error is shown.

## Known limitations

- Playback runs in an mpv process started by the worker. The panel's `<audio>` element is not used because Orca's sandbox blocks external streams.
- Some station URLs may be unreachable; availability varies by station.
- Frequencies are assigned arbitrarily and do not match real broadcast frequencies.
- If the worker exits abnormally, its mpv process may be left running.

## License

MIT. See [LICENSE](LICENSE).
