"use client";

import { useState } from "react";

export type VisitorRow = {
  id: number;
  ipMasked: string;
  device: string;
  browser: string | null;
  os: string | null;
  isAdmin: boolean;
  eventCount: number;
  lastSeenAt: string; // ISO
};

type EventRow = {
  id: number;
  type: string;
  path: string;
  key: string | null;
  label: string | null;
  value: number | null;
  referrer: string | null;
  createdAt: string;
};

const DEVICE_TR: Record<string, string> = {
  desktop: "Masaüstü",
  mobile: "Mobil",
  tablet: "Tablet",
};

function relTime(iso: string) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.round(diff)}s önce`;
  if (diff < 3600) return `${Math.round(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.round(diff / 3600)} sa önce`;
  return `${Math.round(diff / 86400)} gün önce`;
}

function absTime(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function eventLine(e: EventRow) {
  switch (e.type) {
    case "pageview": {
      let src = "";
      if (e.referrer === "direct") src = "doğrudan";
      else if (e.referrer && e.referrer !== "internal") src = `← ${e.referrer}`;
      return { verb: "Sayfa görüntüledi", detail: e.path, extra: src };
    }
    case "page_dwell":
      return { verb: "Sayfada kaldı", detail: e.path, extra: `${e.value ?? 0}sn` };
    case "section_view":
      return { verb: "Bölüm gördü", detail: e.label ?? e.key ?? "", extra: e.path };
    case "section_dwell":
      return {
        verb: "Bölümde durdu",
        detail: `${e.label ?? e.key} (${e.value ?? 0}s)`,
        extra: e.path,
      };
    case "click":
      return {
        verb: "Tıkladı",
        detail: e.key ?? "",
        extra: e.label && e.label !== e.key ? e.label : "",
      };
    case "form":
      return { verb: "Form gönderdi", detail: e.label ?? e.key ?? "", extra: e.path };
    default:
      return { verb: e.type, detail: e.key ?? e.path, extra: "" };
  }
}

export default function VisitorLog({ visitors }: { visitors: VisitorRow[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [events, setEvents] = useState<Record<number, EventRow[]>>({});
  const [loading, setLoading] = useState(false);

  const toggle = async (id: number) => {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    if (!events[id]) {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/analytics/visitor/${id}`);
        const data = await res.json();
        setEvents((prev) => ({ ...prev, [id]: data.events ?? [] }));
      } catch {
        setEvents((prev) => ({ ...prev, [id]: [] }));
      } finally {
        setLoading(false);
      }
    }
  };

  if (!visitors.length) {
    return <p className="adm-hint">Henüz ziyaretçi kaydı yok.</p>;
  }

  return (
    <div className="ana-visitors">
      {visitors.map((v) => {
        const open = openId === v.id;
        return (
          <div key={v.id} className={`ana-visitor${open ? " is-open" : ""}`}>
            <button type="button" className="ana-visitor-row" onClick={() => toggle(v.id)}>
              <span className={`ana-avatar${v.isAdmin ? " is-admin" : ""}`}>
                {v.isAdmin ? "SEN" : v.id}
              </span>
              <span className="ana-visitor-main">
                <span className="ana-visitor-top">
                  <strong>{v.ipMasked}</strong>
                  {v.isAdmin ? <span className="ana-badge sen">SEN</span> : null}
                  <span className="ana-badge">{DEVICE_TR[v.device] ?? v.device}</span>
                </span>
                <span className="ana-visitor-sub">
                  {v.eventCount} olay · son {relTime(v.lastSeenAt)}
                  {v.browser ? ` · ${v.browser}` : ""}
                  {v.os ? ` · ${v.os}` : ""}
                </span>
              </span>
              <span className="ana-visitor-open">{open ? "Kapat ↑" : "Aç ↓"}</span>
            </button>
            {open ? (
              <div className="ana-timeline">
                {loading && !events[v.id] ? (
                  <p className="adm-hint">Yükleniyor…</p>
                ) : (events[v.id] ?? []).length === 0 ? (
                  <p className="adm-hint">Olay bulunamadı.</p>
                ) : (
                  (events[v.id] ?? []).map((e) => {
                    const line = eventLine(e);
                    return (
                      <div key={e.id} className="ana-event">
                        <span className="ana-event-dot" />
                        <div>
                          <div className="ana-event-head">
                            <strong>{line.verb}</strong>
                            <span className="ana-event-detail">{line.detail}</span>
                            {line.extra ? (
                              <span className="ana-event-extra">{line.extra}</span>
                            ) : null}
                          </div>
                          <div className="ana-event-time">
                            {relTime(e.createdAt)} · {absTime(e.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
