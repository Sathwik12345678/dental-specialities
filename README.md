# Dental Specialities

A Vite + React JavaScript website for Dental Specialities. The migration keeps
the existing page markup, CSS, assets, URLs and client-side interactions intact
so there is no visual redesign.

## Run locally

Install dependencies once, then start Vite:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with:

```powershell
npm run build
```

Deploy the generated `dist/` folder to any static host that supports SPA
fallbacks. The supplied `.htaccess` is available when hosting on Apache.

## Lead capture / CRM connection

The PHP/MySQL/Google Sheets lead implementation has been removed. Forms submit
JSON to the Node CRM endpoint `/api/public/queries` by default, matching the
existing CRM's public enquiry API.

If the CRM runs on another origin, copy `.env.example` to `.env.production`,
set `VITE_LEAD_ENDPOINT` to its HTTPS endpoint, then run the production build.
The Node CRM must allow the website origin through CORS and return JSON with
`{ "success": true }` for an accepted lead. Do not put CRM credentials in the
frontend environment file.
