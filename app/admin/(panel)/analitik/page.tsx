import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { getSetting } from "@/lib/settings";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import SavedToast from "@/components/admin/SavedToast";
import {
  getCountOn,
  getDevices,
  getDurationBuckets,
  getKeyBreakdown,
  getLabelBreakdown,
  getOverview,
  getPageDwell,
  getPageVisitors,
  getPathCounts,
  getSectionStats,
  getTitleMaps,
  getTopClicksOn,
  getVisitors,
  type Range,
} from "@/lib/data/analytics";
import { resetAnalytics, setAnalyticsEnabled } from "./actions";
import VisitorLog, { type VisitorRow } from "./VisitorLog";

export const metadata: Metadata = { title: "Analitik" };
export const dynamic = "force-dynamic";

// ---------- yardımcılar ----------

const AY_ADLARI = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function fmtDur(secs: number) {
  const s = Math.round(secs);
  if (s < 60) return `${s}sn`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}dk ${s % 60}sn`;
  const h = Math.floor(m / 60);
  return `${h}sa ${m % 60}dk`;
}

function parseRange(ay?: string, gun?: string): Range {
  if (gun && /^\d{4}-\d{2}-\d{2}$/.test(gun)) {
    const [y, m, d] = gun.split("-").map(Number);
    const from = new Date(y, m - 1, d);
    return { from, to: new Date(y, m - 1, d + 1) };
  }
  if (ay && /^\d{4}-\d{2}$/.test(ay)) {
    const [y, m] = ay.split("-").map(Number);
    return { from: new Date(y, m - 1, 1), to: new Date(y, m, 1) };
  }
  return { from: null, to: null };
}

function monthOptions() {
  const now = new Date();
  const out: { value: string; label: string }[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: `${AY_ADLARI[d.getMonth()]} ${d.getFullYear()}`,
    });
  }
  return out;
}

const TABS = [
  { id: "anasayfa", label: "Anasayfa" },
  { id: "egitimler", label: "Eğitimler" },
  { id: "referanslar", label: "Referanslar" },
  { id: "ekibimiz", label: "Ekibimiz" },
  { id: "blog", label: "Blog" },
  { id: "galeri", label: "Galeri" },
  { id: "iletisim", label: "İletişim" },
  { id: "notlar", label: "Eğitim Notları" },
  { id: "floatbar", label: "Float Bar" },
  { id: "footer", label: "Footer" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ---------- kart bileşenleri ----------

function StatCard({
  title,
  desc,
  value,
  total,
}: {
  title: string;
  desc: string;
  value: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="adm-card ana-card">
      <h3 className="ana-card-title">{title}</h3>
      <p className="ana-card-desc">{desc}</p>
      <div className="ana-stat">
        <strong>{value}</strong>
        <span>/ {total} kişi</span>
      </div>
      <div className="ana-bar-row">
        <div className="ana-bar">
          <span style={{ width: `${Math.min(100, pct)}%` }} />
        </div>
        <span className="ana-pct">%{pct}</span>
      </div>
    </div>
  );
}

function ListCard({
  title,
  desc,
  rows,
  empty = "Henüz veri yok.",
}: {
  title: string;
  desc?: string;
  rows: { label: string; value: string | number }[];
  empty?: string;
}) {
  return (
    <div className="adm-card ana-card">
      <h3 className="ana-card-title">{title}</h3>
      {desc ? <p className="ana-card-desc">{desc}</p> : null}
      {rows.length === 0 ? (
        <p className="adm-hint">{empty}</p>
      ) : (
        <div className="ana-list">
          {rows.map((row, i) => (
            <div key={i} className="ana-list-row">
              <span className="ana-list-label">{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DwellCard({
  title,
  reached,
  totalSecs,
  base,
}: {
  title: string;
  reached: number;
  totalSecs: number;
  base: number;
}) {
  return (
    <div className="adm-card ana-card">
      <h3 className="ana-card-title">{title}</h3>
      <p className="ana-card-desc">
        {base > 0
          ? `Sayfaya gelen ${base} kişiden ${reached}'i bu bölüme ulaştı`
          : "Bu bölüm için henüz veri yok"}
      </p>
      <div className="ana-list">
        <div className="ana-list-row">
          <span className="ana-list-label">Bölüme ulaşan</span>
          <strong>{reached} kişi</strong>
        </div>
        <div className="ana-list-row">
          <span className="ana-list-label">Toplam durma</span>
          <strong>{fmtDur(totalSecs)}</strong>
        </div>
        <div className="ana-list-row">
          <span className="ana-list-label">Ortalama durma</span>
          <strong>{reached > 0 ? fmtDur(totalSecs / reached) : "—"}</strong>
        </div>
      </div>
    </div>
  );
}

// ---------- sekme içerikleri ----------

async function TabContent({ tab, range }: { tab: TabId; range: Range }) {
  if (tab === "anasayfa") {
    const [base, topClicks, sections, teklifOpen] = await Promise.all([
      getPageVisitors("^/$", range),
      getTopClicksOn("/", range),
      getSectionStats("/", range),
      getCountOn("^/$", "teklif:open", ["click"], range),
    ]);
    return (
      <div className="ana-grid">
        <ListCard
          title="Anasayfa — en çok tıklananlar"
          desc="Anasayfadaki bağlantı ve buton tıklamaları"
          rows={topClicks.map((c) => ({ label: c.label || c.key, value: c.clicks }))}
        />
        <StatCard
          title="Teklif penceresi"
          desc="Anasayfadan teklif penceresini açan"
          value={teklifOpen}
          total={base}
        />
        {sections.map((s) => (
          <DwellCard
            key={s.key}
            title={`${s.label} — durma süresi`}
            reached={s.reached}
            totalSecs={s.totalSecs}
            base={base}
          />
        ))}
      </div>
    );
  }

  if (tab === "egitimler") {
    const maps = await getTitleMaps();
    const [base, cats, tops, teklifOpen, teklifForm] = await Promise.all([
      getPageVisitors("^/egitimler", range),
      getPathCounts("^/egitimler/[^/]+$", range, 10),
      getPathCounts("^/egitimler/[^/]+/[^/]+$", range, 10),
      getCountOn("^/egitimler", "teklif:open", ["click"], range),
      getCountOn("^/egitimler", "form:teklif", ["form"], range),
    ]);
    return (
      <div className="ana-grid">
        <ListCard
          title="Kategori görüntülenmeleri"
          desc="Kategori sayfası görüntülenme sayıları"
          rows={cats.map((c) => ({
            label: maps.category.get(c.path) ?? c.path,
            value: c.views,
          }))}
        />
        <ListCard
          title="En çok görüntülenen eğitimler"
          desc="Eğitim detay sayfası görüntülenmeleri (ilk 10)"
          rows={tops.map((t) => ({
            label: maps.training.get(t.path) ?? t.path,
            value: t.views,
          }))}
        />
        <div className="ana-grid-col">
          <StatCard
            title="Teklif penceresi"
            desc="Eğitim sayfalarından teklif penceresini açan"
            value={teklifOpen}
            total={base}
          />
          <StatCard
            title="Teklif gönderenler"
            desc="Eğitim sayfalarından teklif formunu gönderen"
            value={teklifForm}
            total={base}
          />
        </div>
      </div>
    );
  }

  if (tab === "referanslar") {
    const [base, dwell] = await Promise.all([
      getPageVisitors("^/referanslar$", range),
      getPageDwell("^/referanslar$", range),
    ]);
    return (
      <div className="ana-grid">
        <DwellCard
          title="Sayfada durma süresi"
          reached={dwell.visitors}
          totalSecs={dwell.totalSecs}
          base={base}
        />
        <StatCard
          title="Sayfa ziyaretçisi"
          desc="Referanslar sayfasını görüntüleyen"
          value={base}
          total={base}
        />
      </div>
    );
  }

  if (tab === "ekibimiz") {
    const maps = await getTitleMaps();
    const [base, members] = await Promise.all([
      getPageVisitors("^/ekibimiz", range),
      getPathCounts("^/ekibimiz/.+", range, 10),
    ]);
    return (
      <div className="ana-grid">
        <StatCard
          title="Sayfa ziyaretçisi"
          desc="Ekibimiz sayfalarını görüntüleyen"
          value={base}
          total={base}
        />
        <ListCard
          title="Üye detay görüntülenmeleri"
          desc="Ekip üyesi detay sayfaları"
          rows={members.map((m) => ({
            label: maps.member.get(m.path) ?? m.path,
            value: m.views,
          }))}
        />
      </div>
    );
  }

  if (tab === "blog") {
    const maps = await getTitleMaps();
    const posts = await getPathCounts("^/blog/.+", range, 15);
    const total = posts.reduce((acc, p) => acc + p.views, 0);
    return (
      <div className="ana-grid ana-grid-2">
        <ListCard
          title="En çok görüntülenen yazılar"
          desc={`${posts.length} yazı · toplam ${total} görüntülenme`}
          rows={posts.map((p) => ({
            label: maps.blog.get(p.path) ?? p.path,
            value: p.views,
          }))}
        />
      </div>
    );
  }

  if (tab === "galeri") {
    const [base, images] = await Promise.all([
      getPageVisitors("^/galeri$", range),
      getLabelBreakdown("galeri:foto", range, 12),
    ]);
    return (
      <div className="ana-grid">
        <StatCard
          title="Sayfa ziyaretçisi"
          desc="Galeri sayfasını görüntüleyen"
          value={base}
          total={base}
        />
        <ListCard
          title="En çok açılan görseller"
          desc="Lightbox'ta açılma sayıları"
          rows={images.map((i) => ({ label: i.label, value: i.clicks }))}
        />
      </div>
    );
  }

  if (tab === "iletisim") {
    const [base, tel, mail, wa, form] = await Promise.all([
      getPageVisitors("^/iletisim$", range),
      getCountOn("^/iletisim$", "%:tel", ["click"], range),
      getCountOn("^/iletisim$", "%:mailto", ["click"], range),
      getCountOn("^/iletisim$", "%:whatsapp", ["click"], range),
      getCountOn("^/iletisim$", "form:%", ["form"], range),
    ]);
    return (
      <div className="ana-grid">
        <StatCard title="Telefon" desc="Telefon numarasına tıklayan" value={tel} total={base} />
        <StatCard title="E-posta" desc="E-posta adresine tıklayan (mailto)" value={mail} total={base} />
        <StatCard title="WhatsApp" desc="WhatsApp bağlantısına tıklayan" value={wa} total={base} />
        <StatCard title="Form gönderenler" desc="Sayfadaki formu başarıyla gönderen" value={form} total={base} />
      </div>
    );
  }

  if (tab === "notlar") {
    const maps = await getTitleMaps();
    const [base, tries, brands] = await Promise.all([
      getPageVisitors("^/egitim-notlari", range),
      getCountOn("^/egitim-notlari$", "note:code-try", ["click"], range),
      getPathCounts("^/egitim-notlari/.+", range, 12),
    ]);
    return (
      <div className="ana-grid">
        <StatCard
          title="Kod girişi deneyenler"
          desc="Erişim kodu formunu kullanan"
          value={tries}
          total={base}
        />
        <ListCard
          title="Not sayfası görüntülenmeleri"
          desc="Kodla açılan marka not sayfaları"
          rows={brands.map((b) => ({
            label: maps.note.get(b.path) ?? b.path,
            value: b.views,
          }))}
        />
      </div>
    );
  }

  if (tab === "floatbar") {
    const [users, breakdown] = await Promise.all([
      getCountOn("", "floatbar:%", ["click"], range),
      getKeyBreakdown("floatbar:", range),
    ]);
    return (
      <div className="ana-grid">
        <StatCard
          title="Float bar kullananlar"
          desc="Mobil alt bardaki herhangi bir butona tıklayan"
          value={users}
          total={users}
        />
        <ListCard
          title="Buton bazında tıklama"
          desc="Float bar buton dökümü"
          rows={breakdown.map((b) => ({
            label: b.label.replace(/^Float bar — /, ""),
            value: b.clicks,
          }))}
        />
      </div>
    );
  }

  // footer
  const [users, breakdown] = await Promise.all([
    getCountOn("", "footer:%", ["click"], range),
    getKeyBreakdown("footer:", range),
  ]);
  return (
    <div className="ana-grid">
      <StatCard
        title="Footer'ı kullananlar"
        desc="Footer'da herhangi bir bağlantıya tıklayan"
        value={users}
        total={users}
      />
      <ListCard
        title="Footer'da en çok tıklananlar"
        desc="Bağlantı bazında döküm"
        rows={breakdown.map((b) => ({
          label: b.label || b.key.replace(/^footer:/, ""),
          value: b.clicks,
        }))}
      />
    </div>
  );
}

// ---------- sayfa ----------

export default async function AnalitikPage({
  searchParams,
}: {
  searchParams: Promise<{ ay?: string; gun?: string; tab?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const range = parseRange(sp.ay, sp.gun);
  const tab: TabId = (TABS.find((t) => t.id === sp.tab)?.id ?? "anasayfa") as TabId;
  const filtered = range.from !== null;

  const [cfg, overview, devices, buckets, headerTop, visitors] = await Promise.all([
    getSetting("analytics"),
    getOverview(range),
    getDevices(range),
    getDurationBuckets(range),
    getKeyBreakdown("header:", range, 8),
    getVisitors(30),
  ]);

  const deviceTotal = devices.desktop + devices.mobile + devices.tablet;
  const pct = (v: number, t: number) => (t > 0 ? Math.round((v / t) * 100) : 0);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const qs = (params: Record<string, string | undefined>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) u.set(k, v);
    const s = u.toString();
    return s ? `?${s}` : "";
  };

  const visitorRows: VisitorRow[] = visitors.map((v) => ({
    id: v.id,
    ipMasked: v.ipMasked,
    device: v.device,
    browser: v.browser,
    os: v.os,
    isAdmin: v.isAdmin,
    eventCount: v.eventCount,
    lastSeenAt: v.lastSeenAt.toISOString(),
  }));

  const durationRows = [
    { label: "30sn'den az kalanlar", value: buckets.under30 },
    { label: "1-3 dk arası kalanlar", value: buckets.min1to3 },
    { label: "3-5 dk arası kalanlar", value: buckets.min3to5 },
    { label: "5dk'dan fazla kalanlar", value: buckets.over5 },
  ];
  const bucketTotal = durationRows.reduce((acc, r) => acc + r.value, 0);

  return (
    <>
      <SavedToast />
      <div className="adm-page-head">
        <div>
          <h1>Analitik</h1>
          <p>
            Sitenin kendi ölçüm sistemi — ziyaretçiler, tıklamalar, bölüm durma
            süreleri ve dönüşümler. IP adresleri maskeli saklanır.
          </p>
        </div>
        <div className="ana-head-actions">
          <a href="/api/admin/analytics/export" className="btn btn-outline">
            CSV indir
          </a>
          <ConfirmDelete
            action={resetAnalytics}
            label="Tümünü sıfırla"
            confirmText="Tüm analitik verisi (ziyaretçiler + olaylar) kalıcı olarak silinecek. Emin misiniz?"
          />
          <div className="ana-toggle">
            <form action={setAnalyticsEnabled.bind(null, true)}>
              <button
                type="submit"
                className={`ana-toggle-btn${cfg.enabled ? " is-on" : ""}`}
              >
                Aktif
              </button>
            </form>
            <form action={setAnalyticsEnabled.bind(null, false)}>
              <button
                type="submit"
                className={`ana-toggle-btn${!cfg.enabled ? " is-off" : ""}`}
              >
                Pasif
              </button>
            </form>
          </div>
        </div>
      </div>
      <p className="ana-record-state">
        {cfg.enabled ? "Olaylar kaydediliyor" : "Kayıt duraklatıldı"}
      </p>

      {/* Filtre */}
      <div className="adm-card ana-filter">
        <form method="get" className="ana-filter-form">
          <input type="hidden" name="tab" value={tab} />
          <span className="ana-filter-label">Filtrele</span>
          <label>
            Ay
            <select name="ay" defaultValue={sp.ay ?? ""}>
              <option value="">Tüm aylar</option>
              {monthOptions().map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Gün
            <input type="date" name="gun" defaultValue={sp.gun ?? ""} />
          </label>
          <button type="submit" className="btn btn-primary">
            Uygula
          </button>
          <Link href={qs({ tab, gun: todayStr })} className="btn btn-outline">
            Bugün
          </Link>
          <span className="ana-filter-state">
            Aktif:{" "}
            <strong>
              {sp.gun ? sp.gun : sp.ay ? sp.ay : "Tüm zamanlar"}
            </strong>
            {filtered ? (
              <Link href={qs({ tab })} className="ana-filter-clear">
                ✕ temizle
              </Link>
            ) : null}
          </span>
        </form>
      </div>

      {/* Genel istatistikler */}
      <h2 className="ana-section-title">Genel istatistikler</h2>
      <p className="ana-section-desc">Tüm sayfaları kapsayan kartlar</p>
      <div className="ana-grid">
        <StatCard
          title="Teklif penceresi açanlar"
          desc="Herhangi bir Teklif Al butonuyla pencereyi açan"
          value={overview.teklifOpen}
          total={overview.visitors}
        />
        <StatCard
          title="Teklif formu gönderenler"
          desc="Teklif formunu başarıyla gönderen"
          value={overview.teklifForm}
          total={overview.visitors}
        />
        <StatCard
          title="WhatsApp etkileşimi"
          desc="Herhangi bir WhatsApp bağlantısına tıklayan"
          value={overview.whatsapp}
          total={overview.visitors}
        />
        <StatCard
          title="Telefon / Hemen ara"
          desc="Telefon numarasına tıklayan (footer + float bar + iletişim)"
          value={overview.tel}
          total={overview.visitors}
        />
        <StatCard
          title="İletişim formu gönderenler"
          desc="İletişim sayfasındaki formu gönderen"
          value={overview.contactForm}
          total={overview.visitors}
        />
        <StatCard
          title="E-posta tıklayanlar"
          desc="Herhangi bir e-posta adresine tıklayan (mailto)"
          value={overview.mailto}
          total={overview.visitors}
        />
      </div>

      <div className="ana-grid ana-grid-3">
        <ListCard
          title="Header'da en çok tıklananlar"
          desc="Üst menü bağlantı tıklamaları"
          rows={headerTop.map((h) => ({ label: h.label || h.key, value: h.clicks }))}
        />
        <div className="adm-card ana-card">
          <h3 className="ana-card-title">En çok giriş yapılan cihazlar</h3>
          <p className="ana-card-desc">{filtered ? "Seçili aralık" : "Tüm zamanlar"}</p>
          <div className="ana-list">
            {(
              [
                ["Masaüstü", devices.desktop, "ana-bar-green"],
                ["Mobil", devices.mobile, "ana-bar-orange"],
                ["Tablet", devices.tablet, ""],
              ] as const
            ).map(([label, val, cls]) => (
              <div key={label} className="ana-device-row">
                <div className="ana-list-row">
                  <span className="ana-list-label">{label}</span>
                  <strong>
                    {val} · %{pct(val, deviceTotal)}
                  </strong>
                </div>
                <div className={`ana-bar ${cls}`}>
                  <span style={{ width: `${pct(val, deviceTotal)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="adm-card ana-card">
          <h3 className="ana-card-title">Toplam ziyaretçi sayısı</h3>
          <div className="ana-stat ana-stat-lg">
            <strong>{overview.visitors}</strong>
            <span>kişi</span>
          </div>
          <div className="ana-list">
            {durationRows.map((row) => (
              <div key={row.label} className="ana-list-row">
                <span className="ana-list-label">{row.label}</span>
                <strong>
                  {row.value} · %{pct(row.value, bucketTotal)}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sayfa bazlı istatistikler */}
      <h2 className="ana-section-title">Sayfa bazlı istatistikler</h2>
      <p className="ana-section-desc">Bir sayfa seçin, o sayfaya özel kartlar gelsin</p>
      <div className="ana-tabs">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={qs({ tab: t.id, ay: sp.ay, gun: sp.gun })}
            className={`ana-tab${t.id === tab ? " is-active" : ""}`}
          >
            {t.label}
          </Link>
        ))}
      </div>
      <TabContent tab={tab} range={range} />

      {/* Ziyaretçiler */}
      <div className="adm-card ana-card ana-visitors-card">
        <h3 className="ana-card-title">Ziyaretçiler (son 30)</h3>
        <p className="ana-card-desc">
          Karta tıklayınca ziyaretçinin olay akışı açılır. Admin oturumuyla
          gezenler <strong>SEN</strong> rozetiyle işaretlenir.
        </p>
        <VisitorLog visitors={visitorRows} />
      </div>
    </>
  );
}
