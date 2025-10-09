import { posthog } from "@/Config/posthog";

export function trackTaskEvent(
  event: "task_created" | "task_updated" | "task_completed" | "task_deleted",
  props?: Record<string, unknown>
) {
  posthog.capture(event, props);
}

let identified = false;
export function identifyUser(user: { id: string; email?: string; name?: string }) {
  if (identified) return;
  posthog.identify(user.id, { email: user.email, name: user.name });
  identified = true;
}