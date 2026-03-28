# Crafts — CSV to Arc XP migration service

Lightweight Node (ESM) service to validate CSV user data, transform it and send batches to Arc XP migration API.

### Requirements

- Node.js 22+
- npm
- macOS / Unix shell (commands below use bash/zsh)

### Install

```sh
cd /yourfolder/
npm install
```

## Environment

Create a .env file at project root with the variables in file .env.example:

## Folders created at runtime

- ./csvs — uploaded CSVs
- ./logs — general logs and success/error JSONs
- ./logs_requests — optional request logs

The app will create these directories automatically when needed.

## Run (development)

```sh
# recommended: set env vars (or use .env)
npm run dev
```

By default the server listens on port 3000.

## API

POST /csvprocess

- Authentication: middleware expects an Authorization header (Bearer token). Provide whatever token your authenticateToken middleware expects.
- Form fields:
  - files — file upload (form field name is files)
  - headings — full or default

### Curl example:

```sh
curl -v -X POST "http://localhost:3000/csvprocess" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -F "files=@/path/to/users.csv" \
  -F "headings=full"
```

### Response:

- 200 with message that the job runs in background.
- Validation errors or missing file return 4xx.

### Notes:

- The service validates CSV headers and values strictly.
- Use FULL_HEADERS or DEFAULT_HEADERS as expected by the app.
- Uploaded file is moved to ./csvs with a sanitized name and timestamp.

### Processing & logs

- CSV rows are validated and converted into JSON records.
- Records are chunked according to MAX_ROWS_PER_REQUEST and posted to ${URL_ARC_XP}/identity/api/v1/migrate.
- Each request's results are saved into ./logs as success*logs_request*<timestamp>.json and error*logs_request*<timestamp>.json.
- On failures, the service retries up to MAX_RETRIES with RETRY_DELAY_MS backoff.

### Troubleshooting

- App restarts/crashes:
  - Ensure .env values exist (especially URL_ARC_XP and AUTH_TOKEN_ARC_XP).
  - Check ./logs for arc_send_error.txt or JSON logs.
- CSV validation errors:
  - Check log csv_error_logs.txt inside ./logs or console output for which header/row failed.
- Rate limits (HTTP 429): service applies retries and a small delay between requests; tune MAX_RETRIES and DELAY_BETWEEN_REQUESTS_MS.
