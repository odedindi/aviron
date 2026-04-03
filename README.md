# ✈️ Aviron

Real-time aviation tracker — see every aircraft flying above you, powered by [airplanes.live](https://airplanes.live/).

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- 🗺️ **Radar view** — live sweep animation showing aircraft in your vicinity
- 📋 **Flight cards** — callsign, airline name, altitude, speed, heading, and country of origin
- 🔍 **Flight detail panel** — deep-dive into a single aircraft
- 📊 **Stats bar** — at-a-glance summary of visible traffic
- 🌙 **Dark / light theme** — auto-detects system preference
- ⚙️ **Configurable radius** — tune how far out you want to look
- 🗣️ **Voice announcements** — spoken alerts when aircraft pass overhead
- 🕹️ **Demo mode** — works without any account or API key

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+

### Installation

```bash
git clone https://github.com/odedindi/aviron.git
cd aviron
pnpm install
```

### Running locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — the onboarding screen will ask for your location.

### Building for production

```bash
pnpm build
pnpm start
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 4 |
| UI primitives | Radix UI |
| State | Jotai |
| Data fetching | SWR |
| Linter / formatter | Biome |
| Flight data | [airplanes.live](https://airplanes.live/) |
| Airline lookup | [adsbdb.com](https://www.adsbdb.com/) |

## Contributing

Contributions are very welcome! Whether it's a bug fix, a new feature, or just a typo — please feel free to open an issue or a pull request.

- **Bug reports & suggestions** → [Open an issue](../../issues)
- **Code changes** → Fork, branch off `main`, open a PR

There's no formal contributing guide yet; just keep the code style consistent (Biome will tell you if something's off) and describe what your PR does.

## License

[MIT](LICENSE) © Oded Winberger
