import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/lib/api"
import { formatDate, type SupportEvent } from "@/lib/types"
import { Activity, AlertCircle, Clock3, Inbox, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"

export function EventsPage() {
  const [events, setEvents] = useState<SupportEvent[]>([])
  const [checking, setChecking] = useState(false)

  const load = () => api<SupportEvent[]>("/events").then(setEvents)

  useEffect(() => {
    load()
  }, [])

  async function checkInbox() {
    setChecking(true)
    try {
      await api("/poll", { method: "POST" })
      await load()
    } finally {
      setChecking(false)
    }
  }

  const attentionCount = events.filter(
    (event) => event.status === "failed" || event.status === "escalated"
  ).length
  const latestEvent = events[0]

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <p className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            <Activity className="size-4" aria-hidden="true" />
            Inbox monitor
          </p>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Activity overview
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review incoming messages and spot anything that needs attention.
          </p>
        </div>
        <Button
          onClick={checkInbox}
          disabled={checking}
          className="shrink-0 gap-2 rounded-xl shadow-sm"
        >
          <RefreshCw
            className={`size-4 ${checking ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          {checking ? "Checking inbox..." : "Check inbox"}
        </Button>
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-3">
        <Card className="min-w-0 rounded-2xl border-border/70 bg-card/85 shadow-sm">
          <CardContent className="flex min-w-0 items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Inbox className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Events loaded
              </p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums">
                {events.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0 rounded-2xl border-border/70 bg-card/85 shadow-sm">
          <CardContent className="flex min-w-0 items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertCircle className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Needs attention
              </p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums">
                {attentionCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0 rounded-2xl border-border/70 bg-card/85 shadow-sm">
          <CardContent className="flex min-w-0 items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Clock3 className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Latest activity
              </p>
              <p className="mt-0.5 truncate text-sm font-semibold">
                {latestEvent
                  ? formatDate(latestEvent.created_at)
                  : "No activity yet"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="min-w-0 overflow-hidden rounded-2xl border-border/70 bg-card/90 shadow-sm">
        <CardHeader className="border-b border-border/70 px-4 py-4 sm:px-5">
          <CardTitle className="text-base">Recent events</CardTitle>
          <CardDescription>
            Message processing activity from your support inbox.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-4 sm:pl-5">ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Error</TableHead>
                <TableHead className="pr-4 sm:pr-5">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-28 text-center">
                    <span className="text-sm text-muted-foreground">
                      No inbox events yet. Check the inbox to look for new
                      messages.
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="pl-4 font-medium tabular-nums sm:pl-5">
                      {event.id}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={event.status} />
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {event.attempts}
                    </TableCell>
                    <TableCell
                      title={event.error ?? undefined}
                      className="max-w-56 overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground"
                    >
                      {event.error || "--"}
                    </TableCell>
                    <TableCell className="pr-4 text-muted-foreground sm:pr-5">
                      {formatDate(event.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
