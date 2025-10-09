"use client";

import { useEffect } from "react";
import { initPosthog } from "@/Config/posthog";

export default function PosthogInit() {
  useEffect(() => {
    initPosthog();
  }, []);

  return null;
}