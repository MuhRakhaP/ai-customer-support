# AI Customer Support

An AI-assisted email support service for Harbor & Pine. It monitors a Gmail
inbox, classifies customer messages, drafts replies from a support knowledge
base, and escalates messages that need a person. A web dashboard lets support
staff review inbox activity, tickets, conversations, and knowledge-base entries.

## Features

- Polls a Gmail inbox on a configurable interval.
- Skips sent, self-authored, automatic, and bulk/list messages.
- Uses configurable Pydantic AI models to classify messages and prepare replies.
- Uses the knowledge base and application rules to limit answers to verified
  support guidance.
- Escalates cases such as attachments, refund requests, safety concerns,
  angry customers, or questions the knowledge base cannot answer.
- Records inbox events, tickets, and conversation messages in PostgreSQL.
- Provides a password-protected dashboard to review events, tickets, and edit
  the knowledge base.
- Labels processed Gmail messages with `ai-processed` and escalated threads with
  `needs-human`.

The service can send email replies from the configured Gmail account. Test it
with a dedicated mailbox and review the escalation rules and knowledge base
before enabling it on a customer-facing inbox.

## Architecture

- **API and dashboard:** FastAPI serves the API and the built React dashboard.
- **Poller:** A separate process checks Gmail and handles new messages.
- **AI:** Pydantic AI provides configurable classification and reply models.
- **Database:** PostgreSQL stores events, tickets, messages, and knowledge-base
  entries. The included migration is intended for Supabase.
- **Dashboard:** React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

## Requirements

- Docker Engine with Docker Compose
- A PostgreSQL database (the repository includes a Supabase migration)
- A Google Cloud OAuth client with the Gmail API enabled
- An API key for the model provider selected in your environment

For local development, install [uv](https://docs.astral.sh/uv/), Python 3.13 or
newer, and Node.js 22 or newer.

## Configuration

Create a local environment file from the example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and set the required credentials. In particular, set a unique,
strong `DASHBOARD_PASSWORD`; the dashboard refuses authentication when the
password is empty. Do not commit `.env`, OAuth credentials, refresh tokens, or
provider API keys.

| Variable | Purpose |
| --- | --- |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_REFRESH_TOKEN` | Refresh token for the Gmail account |
| `DATABASE_URL` | PostgreSQL connection URL |
| `ANTHROPIC_API_KEY` | API key when using Anthropic models |
| `CLASSIFIER_MODEL` | Pydantic AI model identifier for email classification |
| `AGENT_MODEL` | Pydantic AI model identifier for reply generation |
| `POLL_INTERVAL_SECONDS` | Delay between poller runs (example: `30`) |
| `DASHBOARD_USERNAME` | Dashboard HTTP Basic Auth username |
| `DASHBOARD_PASSWORD` | Dashboard HTTP Basic Auth password; required |
| `PYDANTIC_AI_NO_BANNER` | Optional setting to suppress the Pydantic AI banner |

The model identifiers must match the provider prefix and model supported by your
installed Pydantic AI provider. Configure the matching provider API key if you
change the model provider.

### Gmail OAuth setup

1. In Google Cloud, enable the Gmail API and create OAuth client credentials.
2. Save the downloaded client file as `credentials.json` in the repository
   root. This file is ignored by Git.
3. Install the Python environment and run the helper:

   ```bash
   uv sync
   uv run python -m scripts.get_refresh_token
   ```

4. Complete Google's consent flow, then copy the printed client ID, client
   secret, and refresh token into `.env`.

The application requests the `https://www.googleapis.com/auth/gmail.modify`
scope. Keep the OAuth credentials and refresh token private.

## Database setup

The API and poller expect the schema to exist before they start. For a linked
Supabase project, apply the migration with the Supabase CLI:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

To load or update the initial knowledge-base entries from `knowledge_base/*.md`,
run this from the repository root after setting `DATABASE_URL`:

```bash
uv run python -m scripts.seed_knowledge_base
```

Each `##` heading in a Markdown file becomes an entry. The filename (without
`.md`) is its section. Seeding upserts entries by section and title, so changes
to the Markdown files update the database.

## Run with Docker Compose

After configuring `.env` and applying the database migration:

```bash
docker compose up -d --build
```

Compose builds the dashboard and API into one image and starts the API and
poller as separate services. The API is bound to `127.0.0.1:8081` on the Docker
host.

On the Docker host, open `http://127.0.0.1:8081`. To access a remote VPS from
your computer, create an SSH tunnel:

```bash
ssh -L 8080:localhost:8081 USER@YOUR_SERVER
```

Then open `http://localhost:8080` in your browser. The tunnel keeps the
dashboard port private on the VPS.

Check service status and logs:

```bash
docker compose ps
docker compose logs -f api poller
```

Stop the services without deleting database data:

```bash
docker compose down
```

## Local development

Configure `.env` and the database first. Start the API from the repository root:

```bash
uv sync
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

In another terminal, start the dashboard:

```bash
npm --prefix dashboard ci
npm --prefix dashboard run dev
```

Vite serves the dashboard locally and proxies `/api` requests to
`http://127.0.0.1:8000`. To run inbox polling locally, use a separate terminal:

```bash
uv run python -m app.poller
```

Useful dashboard checks:

```bash
npm --prefix dashboard run lint
npm --prefix dashboard run build
```

## API

The dashboard API uses HTTP Basic Auth with `DASHBOARD_USERNAME` and
`DASHBOARD_PASSWORD`. The health endpoint does not require authentication.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `GET` | `/api/login` | Validate dashboard credentials |
| `GET` | `/api/events` | List recent processing events |
| `GET` | `/api/tickets` | List recent support tickets |
| `GET` | `/api/tickets/{ticket_id}/messages` | List a ticket's messages |
| `GET` | `/api/knowledge-base` | List knowledge-base entries |
| `PUT` | `/api/knowledge-base/{entry_id}` | Update an entry |
| `POST` | `/api/poll` | Check the Gmail inbox immediately |

## Security notes

- The poller can send email from the connected Gmail account. Use a test inbox
  before connecting a production mailbox.
- Protect `.env`, `credentials.json`, database URLs, OAuth tokens, and model API
  keys. Never add them to source control.
- Set a unique dashboard password and expose the dashboard only through a
  trusted HTTPS endpoint or SSH tunnel. The Compose configuration binds its
  published port to loopback.
- Review and maintain the guidance in `knowledge_base/` and the decision rules
  in `app/` before changing customer-facing behavior.
