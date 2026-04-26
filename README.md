# Carbon Dating ✈️

> A Chrome extension that replaces the CO₂ emissions column on Google Flights with the **estimated production year** of the aircraft serving each flight.

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/hgfledgepkmpfgpamfgclkkafddenahh?label=Chrome%20Web%20Store&color=4285f4)](https://chromewebstore.google.com/detail/carbon-dating/hgfledgepkmpfgpamfgclkkafddenahh)
![License](https://img.shields.io/badge/license-MIT-green)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)

---

## What it does

Google Flights shows a CO₂ emissions estimate per flight. Carbon Dating replaces that column with something arguably more useful — the **approximate build year** of the aircraft type flying that route, sourced from a real fleet database of 4 000+ aircraft.

| Before | After |
|--------|-------|
| `213 kg CO₂e` | `~2014 ↗` |

- **On page load** — shows the carrier's fleet-average year immediately.
- **On row expand** — refines to the model-specific year once Google reveals the aircraft type.
- **Connecting flights** — shows one year per leg, comma-separated (`~2019 ↗, ~2022 ↗`).
- **Hold Alt** — temporarily peek at the original Google emissions info.
- Each badge links out to your preferred live flight tracker.

---

## Features

- **Fleet-average fallback** — instant estimate before the aircraft type is known, derived from 4 000+ registered aircraft across 119+ airlines.
- **Model-specific refinement** — upgrades to a more precise year once the aircraft type (e.g. B38M, A21N) is visible in the expanded row.
- **Per-leg years** on connecting flights — no single blended number.
- **Alt-key peek** — hold <kbd>Alt</kbd> to reveal the original CO₂ badge without reloading.
- **Provider preference** — click the toolbar icon to choose your link-out tracker:
  - [Flightera](https://www.flightera.net) *(default)*
  - [Flightradar24](https://www.flightradar24.com)
  - [RadarBox](https://www.radarbox.com)
  - [Trip.com](https://www.trip.com)
- **Live re-render** — switching providers updates all visible badges instantly, no page reload needed.

---

## How it works

```
Google Flights page load
        │
        ▼
MutationObserver watches .NZRfve[data-travelimpactmodelwebsiteurl]
        │
        ├─ Badge appears (collapsed row)
        │       └─ Parse TIM URL → extract carrier IATA + flight number
        │               └─ Look up CARRIER_AVG[iata] → show ~year
        │
        └─ Row expanded (aircraft type visible in DOM text)
                └─ textToTypecodes(text) → ICAO typecode(s)
                        └─ Look up DB[iata][typecode] → show ~year (refined)
```

**Data pipeline:**

1. `aircraftDatabase.csv` — 4 311 registered aircraft with build dates, type codes, and operator IATA codes.
2. `scrape_fleet.py` — Python script that generates the `DB` and `FALLBACK` lookup tables embedded in `content.js`.
3. The embedded `DB` covers ~319 carrier × typecode combinations across 119 airlines.

No network requests are made by the extension. All lookups are in-memory.

---

## Installation

### From the Chrome Web Store

1. Open **[Carbon Dating on the Chrome Web Store](https://chromewebstore.google.com/detail/carbon-dating/hgfledgepkmpfgpamfgclkkafddenahh)**.
2. Click **Add to Chrome** (or **Install**).

### Load unpacked (developer mode)

1. Clone or download this repository.
2. Go to `chrome://extensions` in Chrome.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the repository folder.
5. Navigate to [Google Flights](https://www.google.com/travel/flights) — the extension activates automatically.

---

## Project structure

```
carbon-dating/
├── content.js          # Main content script — DOM injection, DB lookups
├── manifest.json       # Manifest V3 extension config
├── popup.html          # Toolbar popup — provider preference UI
├── popup.js            # Popup logic — reads/writes chrome.storage.sync
├── icons/              # Extension icons (16, 32, 48, 128 px)
└── store-assets/       # Chrome Web Store promotional images
```

---

## Privacy

- Full policy: [PRIVACY.md](PRIVACY.md) (use the GitHub URL of this file for the Chrome Web Store **Privacy policy** field).
- No data is collected, transmitted, or stored externally.
- The only storage used is `chrome.storage.sync` for your provider preference (one string, synced across your own Chrome profile).
- The extension only runs on `https://www.google.com/travel/flights*`.

---

## Contributing

Pull requests are welcome. A few areas that would make good contributions:

- Expanding the aircraft fleet database embedded in `content.js` to cover more carriers and more recent registrations.
- Supporting additional flight tracker providers.
- Localisation — `aria-label` detection currently assumes English Google Flights UI.
- Return-leg detection for non-English locales.

---

## License

MIT — see [LICENSE](LICENSE) for details.
