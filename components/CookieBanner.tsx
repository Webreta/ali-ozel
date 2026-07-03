"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CookieBannerSettings } from "@/lib/settings";

const STORAGE_KEY = "cerez-onay";

export default function CookieBanner({
  config,
}: {
  config: CookieBannerSettings;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!config.enabled) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { version: number; at: number };
        const fresh =
          saved.version === config.version &&
          Date.now() - saved.at < config.intervalHours * 60 * 60 * 1000;
        if (fresh) return;
      }
    } catch {
      /* bozuk kayıt — banner'ı göster */
    }
    setVisible(true);
  }, [config]);

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label={config.title}>
      <div className="cookie-banner-body">
        <strong>{config.title}</strong>
        <p>
          {config.text}
          {config.policyLink ? (
            <>
              {" "}
              <Link href={config.policyLink}>{config.policyLabel || "Detaylar"}</Link>
            </>
          ) : null}
        </p>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          try {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({ version: config.version, at: Date.now() })
            );
          } catch {
            /* localStorage kapalı — sadece bu oturumda gizle */
          }
          setVisible(false);
        }}
      >
        {config.buttonLabel}
      </button>
    </div>
  );
}
