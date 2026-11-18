import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api, logout, saveLogin } from "@/lib/api"
import { ArrowRight, Headphones, ShieldCheck } from "lucide-react"
import { useState } from "react"

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    saveLogin(username, password)
    try {
      await api("/login")
      onLogin()
    } catch {
      logout()
      setError("Wrong username or password")
    }
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 size-80 rounded-full bg-sky-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-32 size-96 rounded-full bg-violet-500/10 blur-3xl"
      />
      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur-xl md:grid-cols-2">
        <section className="hidden flex-col justify-between bg-gradient-to-br from-primary via-primary to-primary/80 p-8 text-primary-foreground md:flex lg:p-10">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10">
            <Headphones className="size-6" aria-hidden="true" />
          </div>
          <div className="my-12">
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-primary-foreground/70 uppercase">
              Harbor &amp; Pine
            </p>
            <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance">
              Thoughtful support starts here.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/70">
              Sign in to manage conversations, follow inbox activity, and keep
              your team&apos;s knowledge close.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-primary-foreground/70">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Private support workspace
          </div>
        </section>
        <div className="min-w-0 p-6 sm:p-9 lg:p-10">
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Headphones className="size-5" aria-hidden="true" />
            </div>
            <span className="font-semibold">Harbor &amp; Pine support</span>
          </div>
          <div className="mb-7">
            <p className="text-sm font-medium text-primary">Welcome back</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Sign in to your workspace
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Enter your support credentials to continue.
            </p>
          </div>
          <form onSubmit={submit} className="flex min-w-0 flex-col gap-5">
            <div className="flex min-w-0 flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm [overflow-wrap:anywhere] break-words text-destructive"
              >
                {error}
              </p>
            )}
            <Button type="submit" className="mt-1 h-10 gap-2 rounded-xl">
              Log in
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
