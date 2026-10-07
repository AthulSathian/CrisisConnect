# CrisisConnect — Emergency Response Hub

A lightweight HTML, CSS and vanilla JavaScript college demo for India. This is not an emergency dispatch system.

## Run on Windows

Extract the ZIP, open PowerShell inside the folder containing `index.html`, then run:

```powershell
py -m http.server 3000
```

Open http://localhost:3000 and keep the terminal open. Press Ctrl+C to stop. Python 3 is required. Alternatively, use the existing `npm start` if `python3` works on your machine. No application dependencies, API key or build step are required. Geolocation requires HTTPS when deployed, or localhost during development.

## October 2026 update

- Refreshed interface with coloured action cards, a navy/teal emergency panel and slowly moving background gradients. Reduced-motion preferences disable animation.
- Persistent, prominent Emergency / Find help near me button; Call 112 remains in the sticky header.
- Fifteen searchable/filterable emergency and support contacts from https://www.india.gov.in/directory/helpline (read 7 October 2026). These are government-listed helplines, not local facility contacts. Specialist coverage/routing may vary.
- Clicking the emergency location button requests browser permission, then searches mapped hospitals, police, fire and ambulance stations within approximately 10 km using https://overpass-api.de/api/interpreter.
- Location is not saved by the app. The lookup sends coordinates rounded to three decimal places to Overpass. That provider may process/log requests. Google Maps receives destination coordinates only when a map link is opened.
- Nearby results include available names, addresses, approximate straight-line distances, published phone numbers and directions. Missing phone numbers are explicitly labelled. Community map records are not independently verified; no completeness, current availability or emergency-care capability is promised.
- A town/district search opens Google Maps when GPS or the map service is unavailable. Official helplines stay usable during loading, denial, no results or errors.
- The emergency button does not call, send an SOS, notify authorities or dispatch anyone. Telephone links open the user's dialler.

## Existing demo boundaries

All shelters remain fictional samples. Reports and volunteer registrations stay in browser local storage and can be deleted. No login, tracking, automatic location request or offline cache is implemented. Safety-guidance references (NDMA, Red Cross and IFRC) still require fresh verification; the successful helpline-directory check does not verify those pages.

## Files and checks

`index.html`: persistent layout. `styles.css`: responsive design. `app.js`: routes and existing features. `emergency.js`: helplines and location search. `npm run check`: syntax checks for both scripts.

`tests/emergency.cjs` exercises location success/denial, API error/empty responses, unsafe external content, filters, mobile overflow and reduced motion with controlled fixtures. For development tests, install Playwright separately, install its Chromium browser, start the site on port 3000, and run `node tests/emergency.cjs`. Optional `CHROMIUM_PATH` selects a local Chromium executable. No testing dependency is needed to run the website.

Live map-provider check from the build environment returned HTTP 406 on 7 October 2026; live nearby results have not been verified here. Test the location lookup on the deployment network before relying on it. The graceful error and manual-search paths remain available.

Validation: JavaScript syntax and the dependency-free `node tests/logic.cjs` checks passed. The browser test suite could not run in this environment because Chromium downloads failed. Mobile layout and visual rendering require browser verification.

## GitHub → Vercel

See **DEPLOY.md** for upload and deployment steps. `vercel.json` configures a dependency-free `npm run build` and serves only the `dist` directory. No Python server or API key is required on Vercel. The new **Call 112 now** button and every listed contact open the phone dialler directly in one tap, subject to device confirmation.
