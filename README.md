# Knowledge base

The schema migration creates the `knowledge_base` table. Apply it to the linked
Supabase project with:

```powershell
supabase db push
```

Add verified support guidance under the `##` headings in `knowledge_base/*.md`.
Each populated heading becomes one database row; the filename (without `.md`)
is stored as its section.

Preflight the Markdown locally, then seed or update the database:

```powershell
uv run python -m scripts.load_knowledge_base
uv run python -m scripts.seed_knowledge_base
```

The seed operation upserts by `(section, title)`. Re-running it updates the
database content, including any edits made to those entries in a dashboard.
The loader rejects missing or empty entries so unfinished templates cannot be
seeded accidentally.