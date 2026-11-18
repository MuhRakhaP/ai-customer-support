import { StatusBadge } from "@/components/status-badge"
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
import { formatDate, type Message, type Ticket } from "@/lib/types"
import { MessageSquareText, Ticket as TicketIcon } from "lucide-react"
import { useEffect, useState } from "react"

export function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selected, setSelected] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    api<Ticket[]>("/tickets").then(setTickets)
  }, [])

  async function open(ticket: Ticket) {
    setSelected(ticket)
    setMessages(await api<Message[]>(`/tickets/${ticket.id}/messages`))
  }

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
      <Card className="min-w-0 overflow-hidden rounded-2xl border-border/70 bg-card/90 shadow-sm">
        <CardHeader className="border-b border-border/70 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <TicketIcon className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base">Customer tickets</CardTitle>
              <CardDescription className="mt-1">
                {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"}{" "}
                shown
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-4 sm:pl-5">Subject</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="pr-4 sm:pr-5">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-28 text-center">
                    <span className="text-sm text-muted-foreground">
                      No tickets to show yet.
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    onClick={() => open(ticket)}
                    data-state={
                      ticket.id === selected?.id ? "selected" : undefined
                    }
                    className="cursor-pointer"
                  >
                    <TableCell
                      title={ticket.subject}
                      className="max-w-48 overflow-hidden pl-4 font-medium text-ellipsis sm:pl-5"
                    >
                      {ticket.subject}
                    </TableCell>
                    <TableCell
                      title={ticket.customer_email}
                      className="max-w-52 overflow-hidden text-ellipsis"
                    >
                      {ticket.customer_email}
                    </TableCell>
                    <TableCell>{ticket.category || "Uncategorized"}</TableCell>
                    <TableCell className="pr-4 sm:pr-5">
                      <StatusBadge status={ticket.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="min-w-0 overflow-hidden rounded-2xl border-border/70 bg-card/90 shadow-sm">
        {selected ? (
          <>
            <CardHeader className="border-b border-border/70 px-4 py-4 sm:px-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <MessageSquareText className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-base [overflow-wrap:anywhere] break-words">
                    {selected.subject}
                  </CardTitle>
                  <CardDescription className="mt-1 [overflow-wrap:anywhere] break-words">
                    {selected.customer_email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex min-w-0 flex-col gap-3 p-4 sm:p-5">
              {selected.proposed_action && (
                <div className="rounded-xl border border-primary/10 bg-primary/[0.04] p-3 text-sm leading-6">
                  <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Suggested next step
                  </p>
                  <p className="[overflow-wrap:anywhere] break-words">
                    {selected.proposed_action}
                  </p>
                </div>
              )}
              {messages.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No messages in this conversation yet.
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.direction === "out"
                        ? "ml-4 min-w-0 rounded-2xl rounded-br-md bg-primary p-3 text-primary-foreground sm:ml-8"
                        : "mr-4 min-w-0 rounded-2xl rounded-bl-md border border-border/70 bg-muted/40 p-3 sm:mr-8"
                    }
                  >
                    <p className="mb-2 text-xs [overflow-wrap:anywhere] break-words opacity-70">
                      {message.from_address} | {formatDate(message.created_at)}
                    </p>
                    <p className="text-sm leading-6 [overflow-wrap:anywhere] break-words whitespace-pre-wrap">
                      {message.body}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </>
        ) : (
          <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <MessageSquareText className="size-5" aria-hidden="true" />
            </div>
            <p className="font-medium">Your conversation view</p>
            <p className="mt-1 max-w-xs text-sm leading-6 text-muted-foreground">
              Choose a ticket to read its messages and suggested next steps.
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
