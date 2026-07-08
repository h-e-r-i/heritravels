import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import heriLogo from "../assets/heri-logo.png.asset.json";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass-panel rounded-2xl p-10">
        <h1 className="text-7xl font-bold text-gradient-electric">404</h1>
        <h2 className="mt-3 text-xl font-semibold">Off the flight path</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          H.E.R.I couldn't triangulate this coordinate. Let's get you back to base.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110"
        >
          Return to Cockpit
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass-panel rounded-2xl p-10">
        <h1 className="text-xl font-semibold">Uplink interrupted</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something turbulent happened. Try again or return home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110"
          >
            Retry
          </button>
          <a href="/" className="rounded-full border border-border px-5 py-2 text-sm font-medium hover:bg-accent">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "H.E.R.I — Wings of Excellence" },
      {
        name: "description",
        content:
          "H.E.R.I (Higher Evolution Remote Intelligence) — an AI copilot for navigation, weather, flights, and exploration. Your best friend that goes with you everywhere.",
      },
      { name: "author", content: "H.E.R.I" },
      { property: "og:title", content: "H.E.R.I — Wings of Excellence" },
      { property: "og:description", content: "AI copilot for travel, weather, flights and exploration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0a1024" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: heriLogo.url },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const navItems = [
  { to: "/", label: "Cockpit" },
  { to: "/navigator", label: "Navigator" },
  { to: "/achievements", label: "Achievements" },
  { to: "/agent", label: "H.E.R.I Agent" },
] as const;

function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 backdrop-blur-xl bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-md bg-primary/40 group-hover:bg-primary/60 transition" />
            <img
              src={heriLogo.url}
              alt="H.E.R.I logo"
              className="relative h-10 w-10 rounded-full object-cover ring-1 ring-primary/40"
            />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-semibold tracking-wider">H.E.R.I</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Wings of Excellence
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/60 bg-surface/60 p-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="px-4 py-1.5 text-sm text-muted-foreground rounded-full transition hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/agent"
          className="hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-electric px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110 transition"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
          Ask H.E.R.I
        </Link>
      </div>

      <nav className="md:hidden flex overflow-x-auto gap-1 px-4 pb-3 -mt-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="whitespace-nowrap px-3 py-1.5 text-xs rounded-full border border-border/60 text-muted-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground data-[status=active]:border-transparent"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
          <span className="tracking-[0.3em] uppercase">H.E.R.I • Higher Evolution Remote Intelligence</span>
        </footer>
      </div>
    </QueryClientProvider>
  );
}
