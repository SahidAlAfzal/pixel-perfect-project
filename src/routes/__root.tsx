import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { TooltipProvider } from "@/components/ui/tooltip";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mc-panel max-w-md p-8 text-center">
        <h1 className="text-5xl font-bold text-foreground text-pixel-shadow">404</h1>
        <h2 className="mt-4 text-sm font-semibold text-gold">Chunk Not Found</h2>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          The coordinates you're looking for don't exist in this world.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="mc-btn inline-flex items-center justify-center px-4 py-2 text-xs font-medium"
          >
            Respawn Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mc-panel max-w-md p-8 text-center">
        <h1 className="text-sm font-semibold tracking-tight text-destructive">
          World Generation Error
        </h1>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          A chunk rendering glitch occurred. You can retry or head back to spawn.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="mc-btn inline-flex items-center justify-center px-4 py-2 text-xs font-medium"
          >
            Retry
          </button>
          <a
            href="/"
            className="mc-btn inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-accent"
          >
            Return to Spawn
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
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/gh/South-Paw/typeface-minecraftia@master/dist/minecraftia.css",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={150}>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
