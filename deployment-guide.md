# Google Cloud Deployment Guide for Hackathon

This guide explains how to deploy this project from scratch using Google Cloud Platform and Firebase.

The project has three parts:

1. `agents/`: FastAPI backend deployed to Google Cloud Run.
2. `client/`: Next.js frontend deployed to Google Cloud Run, with Firebase App Hosting as an alternative.
3. `extension/`: Chrome extension packaged locally or published later through the Chrome Web Store.

Use placeholders like `YOUR_PROJECT_ID` and `YOUR_KEY_HERE` in the commands below. Do not paste real API keys into this file or commit them to GitHub.

---

## 0. What You Need Before Starting

Create accounts for the services used by the app:

- Google Cloud account.
- Firebase account. It uses the same Google account.
- Clerk account for authentication.
- Convex account for the database/backend functions used by the frontend.
- OpenAI API key.
- Anthropic API key.
- Tavily API key.
- Composio API key.
- Upstash Redis REST URL and token, if the Redis-backed features are required.

Install these tools on your computer:

- Git: https://git-scm.com/downloads
- Node.js 20 or newer: https://nodejs.org
- pnpm: https://pnpm.io/installation
- Google Cloud CLI: https://cloud.google.com/sdk/docs/install
- Firebase CLI:

```bash
npm install -g firebase-tools
```

After installing the Google Cloud CLI, restart your terminal so the `gcloud` command is available.

---

## 1. Create and Configure a Google Cloud Project

Go to the Google Cloud Console:

https://console.cloud.google.com

Create a new project, then copy its project ID. The project ID is usually lowercase and may look like:

```text
twin-ai-hackathon
```

In your terminal, log in:

```bash
gcloud auth login
```

Set your active project:

```bash
gcloud config set project YOUR_PROJECT_ID
```

Check that the correct project is selected:

```bash
gcloud config get-value project
```

Enable billing for the project in Google Cloud Console. Cloud Run needs billing enabled, even if your usage stays within free or low-cost limits.

Enable required Google Cloud APIs:

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

Choose a deployment region. This guide uses:

```text
us-central1
```

You can use another region, but keep it consistent in every command.

---

## 2. Prepare Local Environment Files

This repo already ignores `.env` files through `.gitignore`, which is good. Keep real secrets only in local `.env` files or in Google/Firebase environment variables.

Useful local files:

- `agents/.env`
- `client/.env.local`

The backend uses these variables:

```text
ANTHROPIC_API_KEY=YOUR_KEY_HERE
OPENAI_API_KEY=YOUR_KEY_HERE
SERPAPI_API_KEY=YOUR_KEY_HERE
TAVILY_API_KEY=YOUR_KEY_HERE
LLAMA_CLOUD_API_KEY=YOUR_KEY_HERE
COMPOSIO_API_KEY=YOUR_KEY_HERE
CONVEX_SITE_URL=https://YOUR_CONVEX_DEPLOYMENT.convex.site
```

The frontend uses these variables:

```text
OPENAI_API_KEY=YOUR_KEY_HERE
COMPOSIO_API_KEY=YOUR_KEY_HERE
UPSTASH_REDIS_REST_URL=YOUR_UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN=YOUR_UPSTASH_REDIS_REST_TOKEN

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY
CLERK_JWT_ISSUER_DOMAIN=https://YOUR_CLERK_DOMAIN

CONVEX_DEPLOYMENT=YOUR_CONVEX_DEPLOYMENT
NEXT_PUBLIC_CONVEX_URL=https://YOUR_CONVEX_DEPLOYMENT.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://YOUR_CONVEX_DEPLOYMENT.convex.site

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/auth/callback
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/auth/callback

AGENT_BACKEND_URL=https://YOUR_BACKEND_URL
```

Important: `NEXT_PUBLIC_*` variables are visible in the browser. Never put private API keys in variables that start with `NEXT_PUBLIC_`.

---

## 3. Set Up Convex

The frontend has a `client/convex` folder, so deploy Convex before the frontend.

From the `client` folder:

```bash
cd client
pnpm install
npx convex dev
```

Follow the login/setup prompts. Convex will create or connect a deployment.

For production, deploy Convex:

```bash
npx convex deploy
```

After deployment, copy these values from the Convex dashboard or CLI output:

```text
NEXT_PUBLIC_CONVEX_URL=https://YOUR_CONVEX_DEPLOYMENT.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://YOUR_CONVEX_DEPLOYMENT.convex.site
CONVEX_DEPLOYMENT=YOUR_CONVEX_DEPLOYMENT
```

Set Convex environment variables if your Convex functions need them:

```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN https://YOUR_CLERK_DOMAIN
npx convex env set NEXT_PUBLIC_CONVEX_SITE_URL https://YOUR_CONVEX_DEPLOYMENT.convex.site
```

Return to the repo root when done:

```bash
cd ..
```

---

## 4. Set Up Clerk Authentication

In the Clerk dashboard:

1. Create an application.
2. Copy the publishable key and secret key.
3. Copy the JWT issuer domain.
4. Add your local and production URLs in allowed redirect/origin settings.

For local development, use:

```text
http://localhost:3000
```

After the frontend is deployed, also add the deployed frontend URL, for example:

```text
https://twin-ai-frontend-xxxxx-uc.a.run.app
```

Use these values in the frontend Cloud Run environment variables:

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_JWT_ISSUER_DOMAIN
```

---

## 5. Deploy the Backend to Cloud Run

The backend is in `agents/` and already has:

- `agents/Dockerfile`
- `agents/.dockerignore`

Deploy from the repo root:

```bash
cd agents
```

Run this command with your real values:

```bash
gcloud run deploy agents-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="ANTHROPIC_API_KEY=YOUR_KEY_HERE,OPENAI_API_KEY=YOUR_KEY_HERE,SERPAPI_API_KEY=YOUR_KEY_HERE,TAVILY_API_KEY=YOUR_KEY_HERE,LLAMA_CLOUD_API_KEY=YOUR_KEY_HERE,COMPOSIO_API_KEY=YOUR_KEY_HERE,CONVEX_SITE_URL=https://YOUR_CONVEX_DEPLOYMENT.convex.site"
```

On Windows PowerShell, use backticks instead of backslashes:

```powershell
gcloud run deploy agents-backend `
  --source . `
  --region us-central1 `
  --allow-unauthenticated `
  --set-env-vars="ANTHROPIC_API_KEY=YOUR_KEY_HERE,OPENAI_API_KEY=YOUR_KEY_HERE,SERPAPI_API_KEY=YOUR_KEY_HERE,TAVILY_API_KEY=YOUR_KEY_HERE,LLAMA_CLOUD_API_KEY=YOUR_KEY_HERE,COMPOSIO_API_KEY=YOUR_KEY_HERE,CONVEX_SITE_URL=https://YOUR_CONVEX_DEPLOYMENT.convex.site"
```

When the deployment finishes, Cloud Run prints a service URL like:

```text
https://agents-backend-xxxxx-uc.a.run.app
```

Copy that URL. You need it as `AGENT_BACKEND_URL` when deploying the frontend.

Test the backend URL in a browser or terminal:

```bash
curl https://YOUR_BACKEND_URL
```

If the root route does not exist, that may return `404`. That is okay as long as your actual API routes work.

Return to the repo root:

```bash
cd ..
```

---

## 6. Deploy the Frontend to Cloud Run

The frontend is in `client/` and already has:

- `client/Dockerfile`
- `client/next.config.ts` with `output: "standalone"`

From the repo root:

```bash
cd client
```

First, test the production build locally:

```bash
pnpm install
pnpm run build
```

If the build passes, deploy to Cloud Run:

```bash
gcloud run deploy twin-ai-frontend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars="AGENT_BACKEND_URL=https://YOUR_BACKEND_URL,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY,CLERK_JWT_ISSUER_DOMAIN=https://YOUR_CLERK_DOMAIN,CONVEX_DEPLOYMENT=YOUR_CONVEX_DEPLOYMENT,NEXT_PUBLIC_CONVEX_URL=https://YOUR_CONVEX_DEPLOYMENT.convex.cloud,NEXT_PUBLIC_CONVEX_SITE_URL=https://YOUR_CONVEX_DEPLOYMENT.convex.site,NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in,NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up,NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/auth/callback,NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/auth/callback,OPENAI_API_KEY=YOUR_KEY_HERE,COMPOSIO_API_KEY=YOUR_KEY_HERE,UPSTASH_REDIS_REST_URL=YOUR_UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN=YOUR_UPSTASH_REDIS_REST_TOKEN"
```

PowerShell version:

```powershell
gcloud run deploy twin-ai-frontend `
  --source . `
  --region us-central1 `
  --allow-unauthenticated `
  --port 3000 `
  --set-env-vars="AGENT_BACKEND_URL=https://YOUR_BACKEND_URL,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY,CLERK_JWT_ISSUER_DOMAIN=https://YOUR_CLERK_DOMAIN,CONVEX_DEPLOYMENT=YOUR_CONVEX_DEPLOYMENT,NEXT_PUBLIC_CONVEX_URL=https://YOUR_CONVEX_DEPLOYMENT.convex.cloud,NEXT_PUBLIC_CONVEX_SITE_URL=https://YOUR_CONVEX_DEPLOYMENT.convex.site,NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in,NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up,NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/auth/callback,NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/auth/callback,OPENAI_API_KEY=YOUR_KEY_HERE,COMPOSIO_API_KEY=YOUR_KEY_HERE,UPSTASH_REDIS_REST_URL=YOUR_UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN=YOUR_UPSTASH_REDIS_REST_TOKEN"
```

When the deployment finishes, Cloud Run prints a frontend URL like:

```text
https://twin-ai-frontend-xxxxx-uc.a.run.app
```

Open that URL and test:

1. Sign up/sign in.
2. Dashboard loads.
3. Chat or agent API calls work.
4. Convex data loads.
5. Composio-related flows work.

Return to the repo root:

```bash
cd ..
```

---

## 7. Alternative Frontend Deployment: Firebase App Hosting

Use this option if you want Google-managed Next.js hosting instead of a frontend container.

Log in:

```bash
firebase login
```

Create or select a Firebase project connected to your Google Cloud project:

```bash
firebase projects:list
```

Create a Firebase App Hosting backend:

```bash
firebase apphosting:backends:create --project YOUR_PROJECT_ID
```

Follow the CLI prompts:

1. Link your GitHub repository.
2. Choose the `client` app directory if prompted.
3. Select the branch to deploy from.
4. Add the same frontend environment variables listed in section 6.

Firebase App Hosting will build and deploy the Next.js app automatically when you push to the selected branch.

If you use Firebase App Hosting, still deploy `agents/` to Cloud Run and set `AGENT_BACKEND_URL` in Firebase to the backend Cloud Run URL.

---

## 8. Configure the Chrome Extension

The Chrome extension is in:

```text
extension/
```

It has:

- `extension/manifest.json`
- `extension/background.js`
- `extension/content-script.js`
- `extension/popup/popup.html`
- `extension/popup/popup.js`

Before sharing or publishing it, search the extension files for local URLs:

```bash
rg "localhost|127.0.0.1|http://" extension
```

Replace local URLs with your deployed frontend or backend URL.

For hackathon judging, load it locally:

1. Open Chrome.
2. Go to `chrome://extensions/`.
3. Turn on Developer mode.
4. Click Load unpacked.
5. Select the `extension/` folder.

To create a zip for judges:

PowerShell:

```powershell
Compress-Archive -Path extension\* -DestinationPath extension-package.zip -Force
```

Bash:

```bash
cd extension
zip -r ../extension-package.zip .
cd ..
```

Important: `manifest.json` must be at the root of the zip file. It should not be inside an extra nested folder.

For public users after the hackathon, publish the extension to the Chrome Web Store:

1. Go to https://chrome.google.com/webstore/devconsole
2. Create a developer account.
3. Pay the one-time registration fee.
4. Upload the extension zip.
5. Add screenshots, icons, description, category, support email, and privacy details.
6. Submit for review.

---

## 9. Updating an Existing Deployment

After code changes, redeploy the backend:

```bash
cd agents
gcloud run deploy agents-backend --source . --region us-central1 --allow-unauthenticated
cd ..
```

Redeploy the frontend:

```bash
cd client
gcloud run deploy twin-ai-frontend --source . --region us-central1 --allow-unauthenticated --port 3000
cd ..
```

If only environment variables changed, you can update them in the Cloud Run Console:

1. Open Google Cloud Console.
2. Go to Cloud Run.
3. Click the service.
4. Click Edit and deploy new revision.
5. Update Variables and Secrets.
6. Deploy.

---

## 10. Custom Domain

Cloud Run gives URLs like:

```text
https://twin-ai-frontend-xxxxx-uc.a.run.app
```

For a real public app, connect your own domain:

1. Go to Google Cloud Console.
2. Open Cloud Run.
3. Select the frontend service.
4. Go to Manage custom domains.
5. Add your domain.
6. Follow the DNS instructions Google gives you.

After the custom domain works, update:

- Clerk allowed origins and redirects.
- Any extension URLs.
- Any frontend/backend environment variables that reference the old URL.

---

## 11. Common Problems and Fixes

If `gcloud` is not recognized:

- Restart your terminal.
- Reinstall Google Cloud CLI.
- Run `gcloud --version` to verify installation.

If Cloud Run says billing is required:

- Enable billing for the Google Cloud project.

If deployment fails during build:

- Run the build locally first.
- Backend: `cd agents`
- Frontend: `cd client && pnpm run build`
- Check the Cloud Build logs linked in the terminal output.

If frontend API calls still go to localhost:

- Set `AGENT_BACKEND_URL` to the backend Cloud Run URL.
- Redeploy the frontend after changing environment variables.

If Clerk login fails:

- Add your deployed frontend URL to Clerk allowed origins/redirects.
- Confirm `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `CLERK_JWT_ISSUER_DOMAIN`.

If Convex auth or data fails:

- Confirm `NEXT_PUBLIC_CONVEX_URL`.
- Confirm `NEXT_PUBLIC_CONVEX_SITE_URL`.
- Confirm `CLERK_JWT_ISSUER_DOMAIN` in Convex environment variables.
- Run `npx convex deploy` again from `client/`.

If the Chrome extension fails:

- Reload it from `chrome://extensions/`.
- Check extension errors on the same page.
- Search for old local URLs with `rg "localhost|127.0.0.1|http://" extension`.
- Make sure `manifest.json` permissions match the production domains you need.

---

## 12. Final Hackathon Checklist

Before demo day:

- Backend Cloud Run URL works.
- Frontend Cloud Run or Firebase URL works.
- Clerk login works on the deployed frontend URL.
- Convex production deployment is active.
- Frontend has `AGENT_BACKEND_URL` pointing to the backend Cloud Run URL.
- Backend has `CONVEX_SITE_URL` pointing to the Convex site URL.
- All API keys are set as environment variables, not committed to Git.
- Chrome extension is tested with deployed URLs.
- `extension-package.zip` has `manifest.json` at the root.
- Demo account is ready for judges.
- You have a short fallback plan if an external API rate limit or auth flow fails during judging.
