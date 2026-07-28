# portFree

portFree is a cyberpunk-style local port and process control panel. It scans listening ports, classifies each one by risk, shows system telemetry, and lets you inspect or terminate processes from a single dashboard.

## Features

- Live scan of listening ports and active processes
- Risk classification for ports and services: safe, caution, and danger
- System telemetry for CPU, memory, hostname, platform, and uptime
- Search, filtering, and grid/table views
- Pin important ports so they stay at the top of the list
- Kill processes by PID with signal selection
- Quick actions for common development and cleanup tasks
- Auto refresh with a configurable interval

## Tech Stack

- React 18 + Vite
- Express for the local API server
- systeminformation for machine metrics
- find-process and tree-kill for process lookup and termination
- Tailwind CSS for styling

## Requirements

- Node.js 18 or newer
- A shell environment that can run the local network tools used by the scanner
	- macOS / Linux: `lsof`
	- Windows: `netstat`

## Setup

```bash
npm install
```

## Development

Run the frontend and backend in separate terminals:

```bash
npm run dev
```

```bash
npm run server
```

The app uses the Vite frontend during development and the Express API under `/api`.

## Production Build

```bash
npm run build
npm start
```

When `dist/` exists, the Express server serves the built frontend automatically.

## API Endpoints

- `GET /api/ports` - returns discovered listening ports and a risk summary
- `GET /api/system` - returns CPU, memory, uptime, and host information
- `POST /api/kill` - terminates a process by PID, with an optional signal

## Notes

- Pinned ports are stored locally in browser `localStorage`.
- Killing a process may require elevated permissions depending on the port owner.
- Port classification is heuristic-based and intended for quick operational triage, not security auditing.

## License

MIT
