import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import type { Entry } from "@/lib/types"
import { BookOpen, Check, FileText } from "lucide-react"
import { useEffect, useState } from "react"

export function KnowledgeBasePage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api<Entry[]>("/knowledge-base").then(setEntries)
  }, [])

  const sections = [...new Set(entries.map((entry) => entry.section))]

  function select(entry: Entry) {
    setSelectedId(entry.id)
    setTitle(entry.title)
    setContent(entry.content)
    setSaved(false)
  }

  async function save() {
    const updated = await api<Entry>(`/knowledge-base/${selectedId}`, {
      method: "PUT",
      body: JSON.stringify({ title, content }),
    })
    setEntries(
      entries.map((entry) => (entry.id === updated.id ? updated : entry))
    )
    setSaved(true)
  }

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(15rem,0.7fr)_minmax(0,1.3fr)]">
      <Card className="min-w-0 overflow-hidden rounded-2xl border-border/70 bg-card/90 shadow-sm">
        <CardHeader className="border-b border-border/70 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base">Knowledge base</CardTitle>
              <CardDescription className="mt-1">
                {entries.length} {entries.length === 1 ? "article" : "articles"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="max-h-[34rem] min-w-0 overflow-y-auto p-3">
          {sections.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No articles available yet.
            </p>
          ) : (
            <nav
              aria-label="Knowledge base articles"
              className="flex flex-col gap-5"
            >
              {sections.map((section) => (
                <div key={section} className="min-w-0">
                  <p className="mb-2 px-2 text-[11px] font-semibold tracking-[0.14em] [overflow-wrap:anywhere] break-words text-muted-foreground uppercase">
                    {section}
                  </p>
                  <div className="flex min-w-0 flex-col gap-1">
                    {entries
                      .filter((entry) => entry.section === section)
                      .map((entry) => (
                        <button
                          key={entry.id}
                          onClick={() => select(entry)}
                          aria-current={
                            entry.id === selectedId ? "page" : undefined
                          }
                          className={`flex min-w-0 items-start gap-2 rounded-xl px-3 py-2.5 text-left text-sm leading-5 transition-colors hover:bg-muted ${
                            entry.id === selectedId
                              ? "bg-primary/8 font-medium text-primary ring-1 ring-primary/10"
                              : "text-foreground/80"
                          }`}
                        >
                          <FileText
                            className="mt-0.5 size-4 shrink-0 opacity-70"
                            aria-hidden="true"
                          />
                          <span className="min-w-0 [overflow-wrap:anywhere] break-words">
                            {entry.title}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </nav>
          )}
        </CardContent>
      </Card>

      {selectedId === null ? (
        <Card className="min-w-0 rounded-2xl border-border/70 bg-card/90 shadow-sm">
          <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <FileText className="size-5" aria-hidden="true" />
            </div>
            <p className="font-medium">Ready when you are</p>
            <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
              Select an article to review or update the information your support
              team uses.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="min-w-0 overflow-hidden rounded-2xl border-border/70 bg-card/90 shadow-sm">
          <CardHeader className="border-b border-border/70 px-4 py-4 sm:px-5">
            <CardTitle className="text-base">Edit article</CardTitle>
            <CardDescription>
              Changes are saved to your support knowledge base.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex min-w-0 flex-col gap-5 p-4 sm:p-5">
            <div className="flex min-w-0 flex-col gap-2">
              <Label htmlFor="entry-title">Title</Label>
              <Input
                id="entry-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <Label htmlFor="entry-content">Content</Label>
              <Textarea
                id="entry-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-72 resize-y rounded-xl text-sm leading-6"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={save} className="gap-2 rounded-xl">
                <Check className="size-4" aria-hidden="true" />
                Save changes
              </Button>
              {saved && (
                <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                  <Check className="size-4" aria-hidden="true" />
                  Saved
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
