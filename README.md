# CrisisConnect
### Emergency contacts and nearby help, in one place.

CrisisConnect is a lightweight emergency-assistance website for India, built for a college coding challenge themed **“Solve a problem faced by our society.”** It brings helpline numbers, nearby service discovery, safety guidance and community-demo tools into a simple interface designed for people under stress.

**Find help. Stay safe.**

[Get started](#run-locally) · [Deploy on Vercel](#deploy-on-vercel) · [Features](#features) · [Data and privacy](#data-and-privacy) · [Verification status](#verification-status)

> **Project status:** College demonstration with real helpline links and an external nearby-service lookup. CrisisConnect does not send SOS alerts, notify authorities or dispatch responders. Shelter entries are fictional; reports and volunteer registrations stay in the user's browser.

## Why CrisisConnect?

During a crisis, finding a phone number or choosing the next action should take as little effort as possible. CrisisConnect keeps calling accessible, groups contacts by purpose and provides a location-based way to look for mapped services.

The interface uses readable cards, large call targets, restrained colour effects and short navigation paths. Location permission is optional: the helpline directory can be used without it.

## Features

| Feature | What it does |
| --- | --- |
| **One-tap calling** | Opens the device dialler for 112 or a listed contact. The device may ask for confirmation; the website never places a call automatically. |
| **India helpline directory** | Searches and filters 15 selected government-listed emergency, disaster and support contacts. |
| **Nearby services** | Requests location on a button press, then searches mapped hospitals, police stations, fire stations and ambulance stations within approximately 10 km. |
| **Local contact cards** | Shows available names, addresses, published phone numbers, approximate distances and directions. Missing phone numbers are labelled. |
| **Manual town search** | Opens Google Maps results for a town, district or postcode when GPS is unavailable or the user prefers manual search. |
| **Shelter directory demo** | Filters fictional sample shelters by area and accessibility. Availability is always unconfirmed. |
| **Incident report demo** | Validates and saves unverified reports in this browser, with references and individual deletion. |
| **Safety guidance** | Presents short steps for floods, fires and road accidents, with reference links and verification limitations. |
| **Volunteer registration demo** | Saves offers of supplies, transport or shelter support locally. No organisation is contacted. |
| **Accessible interface** | Includes form labels, keyboard focus indicators, a skip link, status feedback and reduced-motion support. |

## How nearby search works

1. Select **Emergency · Find help near me** or **Use my location & find help**.
2. Allow the browser's location request.
3. The app sends a rounded search position to the public **Overpass API**, which queries OpenStreetMap.
4. Results show mapped facilities and any published contact information.
5. Select a call link to open the dialler, or directions to open Google Maps.

Nearby records are community-maintained and may be incomplete or outdated. Distances are approximate straight-line distances, not travel distances. A hospital listing does not confirm emergency-care capability, opening hours or current availability.

If permission is denied, no results are found or the provider fails, the India helplines and manual town search remain available. The app cannot guarantee a list of every emergency service near a user.

## Run locally

### 1. Get the project

Clone the repository:

```bash
git clone https://github.com/AthulSathian/CrisisConnect.git
cd CrisisConnect
```

Alternatively, use **Code → Download ZIP**, extract it and open a terminal in the folder containing `index.html`.

### 2. Start a local server

**Windows / PowerShell** — requires Python 3:

```powershell
py -m http.server 3000
```

**macOS / Linux:**

```bash
python3 -m http.server 3000
```

Open **[http://localhost:3000](http://localhost:3000)**. Keep the terminal open; press **Ctrl+C** to stop the server.

If Node.js/npm and the `python3` command are available, `npm start` is another way to start the same server. No application dependencies or `npm install` are needed to run the website.

Use localhost during development. Geolocation requires HTTPS outside localhost; opening `index.html` directly is not the supported setup.

## Deploy on Vercel

The repository includes a dependency-free static build and Vercel configuration.

1. Sign in at **[Vercel](https://vercel.com/new)** with GitHub.
2. Import **AthulSathian/CrisisConnect**.
3. Keep the root directory at `./`, where `package.json` and `vercel.json` are located.
4. Use the following settings, supplied by `vercel.json`:

| Setting | Value |
| --- | --- |
| Framework / Application Preset | Other |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | Empty — no dependencies to install |
| Environment Variables | None |
| API Keys | None required |

5. Click **Deploy**, then open the HTTPS URL Vercel provides.

The build copies only the four browser assets into `dist/`. Vercel serves those static files; it does not need a Python server. Navigation uses hash routes such as `/#emergency`, so no server-side route rewrites are required.

After the GitHub integration is connected, pushes to the configured production branch trigger deployments. See [DEPLOY.md](DEPLOY.md) for the full guide.

**Before sharing:** check the deployed site on a phone, test both location permission and denial, and confirm call links open the dialler without completing a test call to emergency services.

## Technology

- **HTML5** for page structure.
- **CSS3** for responsive layouts and subtle animated gradients.
- **Vanilla JavaScript** for navigation, validation, search and browser storage.
- **Browser Geolocation API** for optional coordinates.
- **OpenStreetMap / Overpass API** for nearby mapped facilities.
- **Google Maps links** for directions and manual searches.
- **Node.js** for syntax checks and static build generation.
- **Python 3** for optional local development serving.
- **Vercel** configuration for static hosting.

There is no frontend framework, application dependency, database, authentication system or custom backend.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Persistent header, emergency controls, main container and footer |
| `styles.css` | Layout, colour effects, mobile rules and reduced-motion support |
| `app.js` | Hash routes, sample shelters, safety guidance and local demo forms |
| `emergency.js` | Helpline directory, geolocation and nearby-service lookup |
| `build.cjs` | Copies browser assets into `dist/` |
| `vercel.json` | Vercel framework, build and output settings |
| `package.json` | Development, check, test and build commands |
| `tests/logic.cjs` | Dependency-free checks using controlled fixtures |
| `tests/emergency.cjs` | Playwright browser checks using controlled fixtures |
| `DEPLOY.md` | GitHub upload and Vercel deployment instructions |

## Development commands

Run these from the project root with Node.js/npm installed:

```bash
npm run check   # Check syntax of app.js and emergency.js
npm test        # Run controlled logic checks
npm run build   # Generate the static dist/ folder
```

To preview the build locally:

```powershell
py -m http.server 3000 --directory dist
```

On macOS/Linux, substitute `python3` for `py`.

### Optional browser checks

Browser testing requires a separate Playwright development installation:

```bash
npm install --no-save --package-lock=false playwright
npx playwright install chromium
```

Start the website on port 3000 in another terminal, then run:

```bash
node tests/emergency.cjs
```

The suite covers location responses, lookup failures, filtering, safe rendering of external content, mobile overflow and reduced-motion behaviour. An optional `CHROMIUM_PATH` environment variable selects a local Chromium executable. Test screenshots are written to the system temporary directory.

## Data and privacy

| Data | How it is handled |
| --- | --- |
| **Helpline directory** | A bundled snapshot of 15 selected numbers from the National Portal of India, checked on 7 October 2026. It is not automatically synchronised. Specialist coverage and routing can vary. |
| **Location** | Requested only after a location-search button is pressed. Coordinates are not persisted by the app. A position rounded to three decimal places is sent to Overpass; that service may process or log requests. |
| **Nearby facilities** | Retrieved from community-maintained OpenStreetMap records. Contact details and availability are not independently verified. |
| **External maps** | Opening directions shares destination coordinates with Google Maps. Manual search shares the entered town and service query. |
| **Incident reports** | Stored under `cc-reports` in this browser's local storage. Contact details are optional. Nothing is submitted to responders. |
| **Volunteer registrations** | Stored under `cc-volunteers` in this browser's local storage. Nothing is sent to an organisation. |
| **Sample shelters** | All names, addresses and accessibility details are fictional. Directions point to the general area, not a real shelter. |

Delete individual reports or registrations on their pages, or clear both through **Sources & data transparency**. Anyone using the same browser profile may be able to see saved records.

The app has no analytics or tracking code. External providers have their own privacy policies. Offline caching is not implemented; external lookups and links require connectivity.

## Verification status

| Check | Status |
| --- | --- |
| JavaScript syntax | Passed |
| Controlled logic checks | Passed |
| Static build | Passed |
| National Portal helpline directory | Retrieved and checked on 7 October 2026 |
| Live nearby-service lookup | Not verified: the build environment received HTTP 406 from the provider |
| Current Playwright browser suite | Not run successfully: Chromium downloads failed in the build environment |
| Current visual and mobile layout | Requires browser verification |
| Safety-reference content | Fresh verification remains outstanding |

Passing fixture-based checks does not establish live provider availability. Check nearby search on the deployment network before relying on it.

## Sources and attribution

- [National Portal of India — Helpline directory](https://www.india.gov.in/directory/helpline)
- [Government of India — Emergency Response Support System](https://112.gov.in/)
- [NDMA — Floods](https://ndma.gov.in/Natural-Hazards/Floods)
- [American Red Cross — Home fire safety](https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/fire.html)
- [IFRC — International first aid, resuscitation and education guidelines](https://www.ifrc.org/document/international-first-aid-resuscitation-and-education-guidelines)
- [OpenStreetMap contributors and ODbL attribution](https://www.openstreetmap.org/copyright)
- [Vercel — Git deployments](https://vercel.com/docs/git)

The helpline-directory check does not verify the separate safety-guidance pages. CrisisConnect is an independent college project and is not affiliated with government emergency services.
