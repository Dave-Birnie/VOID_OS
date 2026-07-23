"use client";

import { useEffect } from "react";

// Stashes a ?ref=CODE invite code into localStorage so it survives until the
// visitor signs up (possibly after email confirmation). Mounted in the root
// layout; renders nothing.
export function RefCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref && /^[a-zA-Z0-9]{4,16}$/.test(ref)) {
        localStorage.setItem("void_ref", ref.toUpperCase());
      }
    } catch {
      /* ignore */
    }
  }, []);

  return null;
}
