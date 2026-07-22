"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type TrackEvent = {
  type: "pageview" | "page_dwell" | "section_view" | "section_dwell" | "click" | "form";
  path: string;
  key?: string;
  label?: string;
  value?: number;
  referrer?: string;
};

type SectionState = {
  label: string;
  seen: boolean;
  intersecting: boolean;
  visibleSince: number | null;
};

/**
 * First-party analitik izleyici. Olayları kuyruklar, 6 sn'de bir ya da sayfa
 * kapanırken sendBeacon ile /api/track'e yollar.
 *  - pageview (referrer: direct | internal | dış URL)
 *  - page_dwell: sayfada görünür geçirilen saniye (visibility bazlı)
 *  - section_view / section_dwell: [data-sec] işaretli bölümler
 *  - click: [data-ev] işaretli öğeler + otomatik tel/wa/mailto ve
 *    header/footer/link bağlantıları
 *  - form: "lead-conversion" olayı (teklif / iletişim formu)
 */
export default function AnalyticsTracker({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();

  const queue = useRef<TrackEvent[]>([]);
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loaded = useRef(false);
  const lastPageview = useRef<{ path: string; t: number }>({ path: "", t: 0 });
  const currentPath = useRef<string>("");
  // page dwell
  const visibleSince = useRef<number | null>(null);
  const dwellAcc = useRef(0);
  // sections
  const sections = useRef<Map<Element, SectionState>>(new Map());
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const push = (ev: TrackEvent) => {
      queue.current.push(ev);
      if (queue.current.length >= 25) flush();
      else if (!flushTimer.current) flushTimer.current = setTimeout(flush, 6000);
    };

    const flush = (useBeacon = false) => {
      if (flushTimer.current) {
        clearTimeout(flushTimer.current);
        flushTimer.current = null;
      }
      if (!queue.current.length) return;
      const body = JSON.stringify({ events: queue.current.splice(0, 50) });
      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    };

    // ---- page dwell ----
    const settleDwell = () => {
      if (visibleSince.current !== null) {
        dwellAcc.current += (Date.now() - visibleSince.current) / 1000;
        visibleSince.current = Date.now();
      }
    };
    const finishPageDwell = (path: string) => {
      settleDwell();
      const secs = Math.round(dwellAcc.current);
      dwellAcc.current = 0;
      visibleSince.current = document.visibilityState === "visible" ? Date.now() : null;
      if (secs >= 1 && path) push({ type: "page_dwell", path, value: secs });
    };

    // ---- sections ----
    const finishSection = (el: Element, st: SectionState, path: string) => {
      if (st.visibleSince === null) return;
      const secs = (Date.now() - st.visibleSince) / 1000;
      st.visibleSince = null;
      if (secs >= 1) {
        push({
          type: "section_dwell",
          path,
          key: (el as HTMLElement).dataset.sec,
          label: st.label,
          value: Math.max(1, Math.round(secs)),
        });
      }
    };
    const teardownSections = (path: string) => {
      sections.current.forEach((st, el) => finishSection(el, st, path));
      sections.current.clear();
      observer.current?.disconnect();
      observer.current = null;
    };
    const scanSections = (path: string) => {
      const els = document.querySelectorAll<HTMLElement>("[data-sec]");
      if (!els.length) return;
      observer.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const st = sections.current.get(entry.target);
            if (!st) continue;
            st.intersecting = entry.isIntersecting;
            if (entry.isIntersecting) {
              if (!st.seen) {
                st.seen = true;
                push({
                  type: "section_view",
                  path,
                  key: (entry.target as HTMLElement).dataset.sec,
                  label: st.label,
                });
              }
              if (st.visibleSince === null) st.visibleSince = Date.now();
            } else {
              finishSection(entry.target, st, path);
            }
          }
        },
        { threshold: 0.35 }
      );
      els.forEach((el) => {
        sections.current.set(el, {
          label: el.dataset.secLabel ?? el.dataset.sec ?? "",
          seen: false,
          intersecting: false,
          visibleSince: null,
        });
        observer.current!.observe(el);
      });
    };

    // ---- clicks ----
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest?.("[data-ev], a[href]") as HTMLElement | null;
      if (!el) return;
      const path = currentPath.current || location.pathname;
      const text = (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 80);

      if (el.dataset.ev) {
        push({ type: "click", path, key: el.dataset.ev, label: el.dataset.evLabel ?? text });
        return;
      }
      const href = el.getAttribute("href") ?? "";
      if (!href || href === "#") return;
      const zone = el.closest(".site-header")
        ? "header"
        : el.closest(".site-footer")
          ? "footer"
          : "link";
      let key: string;
      if (href.startsWith("tel:")) key = `${zone}:tel`;
      else if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) key = `${zone}:whatsapp`;
      else if (href.startsWith("mailto:")) key = `${zone}:mailto`;
      else if (href.startsWith("http") && !href.startsWith(location.origin))
        key = `${zone}:dis:${href.slice(0, 120)}`;
      else key = `${zone}:${href.split("#")[0].split("?")[0] || "/"}`;
      push({ type: "click", path, key: key.slice(0, 160), label: text });
    };

    // ---- global olaylar ----
    const onTeklifOpen = () => {
      push({
        type: "click",
        path: currentPath.current || location.pathname,
        key: "teklif:open",
        label: "Teklif penceresi açıldı",
      });
      flush();
    };
    const onLead = (e: Event) => {
      const kind = (e as CustomEvent).detail?.kind === "contact" ? "contact" : "teklif";
      push({
        type: "form",
        path: currentPath.current || location.pathname,
        key: `form:${kind}`,
        label: kind === "contact" ? "İletişim formu" : "Teklif formu",
      });
      flush();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        settleDwell();
        visibleSince.current = null;
        sections.current.forEach((st, el) => finishSection(el, st, currentPath.current));
        flush(true);
      } else {
        visibleSince.current = Date.now();
        // sekmeye dönüldü: hâlâ görünür bölümlerin sayacını yeniden başlat
        sections.current.forEach((st) => {
          st.visibleSince = st.intersecting ? Date.now() : null;
        });
      }
    };
    const onPageHide = () => {
      sections.current.forEach((st, el) => finishSection(el, st, currentPath.current));
      finishPageDwell(currentPath.current);
      flush(true);
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("open-teklif", onTeklifOpen);
    window.addEventListener("lead-conversion", onLead);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);

    // ---- pageview + bölüm taraması (rota değişince) ----
    const prevPath = currentPath.current;
    if (prevPath && prevPath !== pathname) {
      teardownSections(prevPath);
      finishPageDwell(prevPath);
    }
    currentPath.current = pathname;
    if (visibleSince.current === null && document.visibilityState === "visible") {
      visibleSince.current = Date.now();
    }

    // StrictMode / çift mount koruması: aynı path'e 1 sn içinde ikinci pageview atma
    const now = Date.now();
    if (lastPageview.current.path !== pathname || now - lastPageview.current.t > 1000) {
      lastPageview.current = { path: pathname, t: now };
      let referrer = "internal";
      if (!loaded.current) {
        referrer =
          document.referrer && !document.referrer.startsWith(location.origin)
            ? document.referrer.slice(0, 400)
            : "direct";
      }
      loaded.current = true;
      push({ type: "pageview", path: pathname, referrer });
    }

    // İçerik render olduktan sonra bölümleri tara
    const scanTimer = setTimeout(() => scanSections(pathname), 400);

    return () => {
      clearTimeout(scanTimer);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("open-teklif", onTeklifOpen);
      window.removeEventListener("lead-conversion", onLead);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      teardownSections(currentPath.current);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, enabled]);

  return null;
}
