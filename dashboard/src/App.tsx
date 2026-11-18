import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isLoggedIn, logout } from "@/lib/api"
import { EventsPage } from "@/pages/events"
import { KnowledgeBasePage } from "@/pages/knowledge-base"
import { LoginPage } from "@/pages/login"
import { TicketsPage } from "@/pages/tickets"
import {
  BookOpen,
  Headphones,
  LogOut,
  MessagesSquare,
  Sparkles,
  Ticket,
} from "lucide-react"
import { useState } from "react"

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn())

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />
  }

  function logOut() {
    logout()
    setLoggedIn(false)
  }

  return (
    <div className="min-h-svh">
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-7 flex min-w-0 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/15">
              <Headphones className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">
                Harbor &amp; Pine
              </p>
              <p className="text-xs text-muted-foreground">Support workspace</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="shrink-0 gap-2 rounded-xl bg-card/70"
            onClick={logOut}
          >
            <LogOut className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Log out</span>
          </Button>
        </header>

        <section className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 px-5 py-7 text-primary-foreground shadow-xl shadow-primary/10 sm:px-8 sm:py-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-12 size-72 rounded-full border border-primary-foreground/10 bg-primary-foreground/5"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-28 -bottom-36 size-72 rounded-full border border-primary-foreground/10"
          />
          <div className="relative max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-1 text-xs font-medium tracking-wide">
              <Sparkles
                className="size-3.5 text-emerald-200"
                aria-hidden="true"
              />
              SUPPORT OPERATIONS
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Every conversation, in one clear view.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-primary-foreground/75 sm:text-base">
              Keep up with incoming activity, customer tickets, and the
              knowledge your team relies on.
            </p>
          </div>
        </section>

        <Tabs defaultValue="events" className="min-w-0">
          <TabsList className="grid h-auto w-full grid-cols-3 rounded-2xl border border-border/70 bg-card/80 p-1.5 shadow-sm sm:inline-flex sm:w-auto sm:gap-1">
            <TabsTrigger
              value="events"
              className="min-w-0 flex-col gap-1 rounded-xl px-2 py-2.5 text-xs sm:flex-row sm:gap-2 sm:px-4 sm:text-sm"
            >
              <MessagesSquare className="size-4 shrink-0" aria-hidden="true" />
              <span>Activity</span>
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="min-w-0 flex-col gap-1 rounded-xl px-2 py-2.5 text-xs sm:flex-row sm:gap-2 sm:px-4 sm:text-sm"
            >
              <Ticket className="size-4 shrink-0" aria-hidden="true" />
              <span>Tickets</span>
            </TabsTrigger>
            <TabsTrigger
              value="knowledge-base"
              className="min-w-0 flex-col gap-1 rounded-xl px-2 py-2.5 text-xs sm:flex-row sm:gap-2 sm:px-4 sm:text-sm"
            >
              <BookOpen className="size-4 shrink-0" aria-hidden="true" />
              <span>Knowledge</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="events" className="mt-5 min-w-0">
            <EventsPage />
          </TabsContent>
          <TabsContent value="tickets" className="mt-5 min-w-0">
            <TicketsPage />
          </TabsContent>
          <TabsContent value="knowledge-base" className="mt-5 min-w-0">
            <KnowledgeBasePage />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
