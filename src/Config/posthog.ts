"use client";
import posthog from "posthog-js";

let initialized = false;

export function initPosthog() {
  if (initialized) return;
  if (typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key || !host) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("PostHog: faltando NEXT_PUBLIC_POSTHOG_KEY/HOST");
    }
    return;
  }

  posthog.init(key, {
    api_host: host,
    capture_pageview: true,
  });

  initialized = true;
}

export { posthog };