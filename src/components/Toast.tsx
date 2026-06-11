"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const TOAST_DURATION_MS = 4000;

export function Toast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: CustomEvent<string>) => {
      setMessage(e.detail);
    };
    window.addEventListener("show-success-toast", handler as EventListener);
    return () =>
      window.removeEventListener("show-success-toast", handler as EventListener);
  }, []);

  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => setMessage(null), TOAST_DURATION_MS);
    return () => clearTimeout(id);
  }, [message]);

  if (!message) return null;

  return createPortal(
    <div
      role="alert"
      className="fixed bottom-6 left-6 z-[100] max-w-sm rounded-lg bg-green-600 px-5 py-4 font-figtree text-[15px] font-medium text-white shadow-lg"
    >
      {message}
    </div>,
    document.body,
  );
}
