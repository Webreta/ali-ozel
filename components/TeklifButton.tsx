"use client";

import type { ReactNode } from "react";

export function openTeklif() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-teklif"));
  }
}

export default function TeklifButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={openTeklif}>
      {children}
    </button>
  );
}
