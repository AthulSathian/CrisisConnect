# CrisisConnect — Emergency Response Hub

A mobile-first, dependency-free college demo using semantic HTML, CSS and vanilla JavaScript. Requires Python 3 to serve the site; Node is optional for the syntax check.

## Run

From `/workspace/CrisisConnect`:

```sh
npm start
# Or: python3 -m http.server 3000 --bind 0.0.0.0
```

Open the served site through your environment's forwarded port 3000. No install, API keys, login, database or build step is required. `npm run check` checks JavaScript syntax.

## Demo boundaries

- Call 112 opens the dialler and does not automatically place a call.
- All shelters are fictional and labelled sample data. Availability is not confirmed. Directions open Google Maps for the general area, never an invented shelter.
- Reports are unverified and stored in this browser only. Emergency services are not notified.
- Volunteer registrations are saved locally and not sent to an organisation.
- Delete individual records on their respective pages, or all records on Sources & data transparency.
- Location is optional, requested only after a button press, and not stored or reverse-geocoded.
- There is no offline caching. System fonts keep the site lightweight without external font requests.
- Authoritative source links are included for ERSS, NDMA, Red Cross and IFRC. Retrieval on 7 October 2026 was blocked by the environment proxy. This is disclosed in the interface; fresh source verification is outstanding before real-world use.

## Structure

`index.html` contains the persistent header/footer. `styles.css` provides responsive styling and reduced-motion support. `app.js` contains hash routes, sample shelter data, guidance and local forms. Treat this as an event prototype, not an emergency dispatch system. Serve over HTTPS for geolocation outside localhost.
