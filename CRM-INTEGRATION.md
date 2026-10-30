# Node CRM lead integration

The React site sends each booking form as JSON to:

```text
/api/public/queries
```

That is the default path used by the existing Node CRM. If the CRM is hosted
on a different origin, set `VITE_LEAD_ENDPOINT` in `.env.production` before
building the frontend.

The request uses `POST` with `Content-Type: application/json`. Important
fields are `name`, `phone`, `treatmentInterest`, `preferred_time`, `message`,
`consent`, `source`, `source_page`, `page_url`, and the honeypot `website`.
Return a 2xx JSON response containing:

```json
{ "success": true }
```

For a separately hosted CRM, allow the website domain with CORS for `POST` and
the `Content-Type` header. Keep all database, email, webhook and CRM secrets
in the Node application, never in the Vite environment file.
