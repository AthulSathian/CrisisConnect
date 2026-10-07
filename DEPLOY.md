# Upload to GitHub and deploy on Vercel

1. Extract `CrisisConnect_Vercel_Ready.zip`.
2. Open the extracted `CrisisConnect` folder. Upload its **contents** to the root of your GitHub repository using **Add file → Upload files**. Include `index.html`, `styles.css`, `app.js`, `emergency.js`, `package.json`, `build.cjs`, and `vercel.json`. Commit the upload. Do not upload the ZIP itself.
3. Go to https://vercel.com/new and connect GitHub. Import the repository.
4. Set Root Directory to the folder containing `package.json` and `vercel.json` (normally `./`). Choose **Other** for Framework Preset if asked. The included configuration sets Build Command to `npm run build`, Output Directory to `dist`, and skips dependency installation. No environment variables or API keys are required.
5. Click **Deploy**, then open the resulting HTTPS URL on your phone.
6. Check that Call 112 and contact buttons open the phone dialler, without completing a test call to an emergency service. Test location permission, denial, and nearby lookup on the deployed URL. The map provider can be unavailable; official helplines and manual map search remain available.

One tap on a call link opens the device dialler. Browser or operating-system confirmation is outside the website's control. Desktop computers may require a calling application. The location button searches only; it never initiates a call or sends an SOS.

Future commits to the connected production branch trigger new deployments. Existing custom Vercel settings should match `vercel.json`. No Python process is needed on Vercel: it serves the static `dist` files. Hash routes such as `/#emergency` do not require server rewrites.

References: https://vercel.com/docs/git and https://vercel.com/docs/project-configuration/vercel-json

This project is prepared for deployment. Uploading or pushing to GitHub does not by itself confirm a successful Vercel deployment. Location service and visual-browser verification limitations are documented in README.md.
