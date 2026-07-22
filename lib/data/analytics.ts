import "server-only";
import { sql, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  analyticsEvents,
  analyticsVisitors,
  blogPosts,
  brandNotes,
  categories,
  teamMembers,
  trainings,
} from "@/db/schema";

// Canlı yönetim verisi — unstable_cache YOK, her istekte taze okunur.

export type Range = { from: Date | null; to: Date | null };

const n = (v: unknown) => Number(v ?? 0);

const inRange = (r: Range) =>
  sql`${r.from ? sql`e.created_at >= ${r.from}` : sql`true`} and ${
    r.to ? sql`e.created_at < ${r.to}` : sql`true`
  }`;

type Row = Record<string, unknown>;
const exec = async (q: ReturnType<typeof sql>): Promise<Row[]> =>
  (await db.execute(q)) as unknown as Row[];

// ---------- Genel istatistikler ----------

export async function getOverview(r: Range) {
  const rows = await exec(sql`
    select
      count(distinct e.visitor_id) as visitors,
      count(distinct e.visitor_id) filter (where e.type = 'click' and e.key = 'teklif:open') as teklif_open,
      count(distinct e.visitor_id) filter (where e.type = 'form' and e.key = 'form:teklif') as teklif_form,
      count(distinct e.visitor_id) filter (where e.type = 'form' and e.key = 'form:contact') as contact_form,
      count(distinct e.visitor_id) filter (where e.type = 'click' and e.key like '%:whatsapp') as whatsapp,
      count(distinct e.visitor_id) filter (where e.type = 'click' and e.key like '%:tel') as tel,
      count(distinct e.visitor_id) filter (where e.type = 'click' and e.key like '%:mailto') as mailto
    from analytics_events e
    where ${inRange(r)}`);
  const row = rows[0] ?? {};
  return {
    visitors: n(row.visitors),
    teklifOpen: n(row.teklif_open),
    teklifForm: n(row.teklif_form),
    contactForm: n(row.contact_form),
    whatsapp: n(row.whatsapp),
    tel: n(row.tel),
    mailto: n(row.mailto),
  };
}

export async function getDevices(r: Range) {
  const rows = await exec(sql`
    select v.device, count(distinct e.visitor_id) as u
    from analytics_events e
    join analytics_visitors v on v.id = e.visitor_id
    where ${inRange(r)}
    group by v.device`);
  const out = { desktop: 0, mobile: 0, tablet: 0 };
  for (const row of rows) {
    const d = String(row.device) as keyof typeof out;
    if (d in out) out[d] = n(row.u);
  }
  return out;
}

export async function getDurationBuckets(r: Range) {
  const rows = await exec(sql`
    with d as (
      select e.visitor_id, coalesce(sum(e.value) filter (where e.type = 'page_dwell'), 0) as secs
      from analytics_events e
      where ${inRange(r)}
      group by e.visitor_id
    )
    select
      count(*) filter (where secs < 30) as b1,
      count(*) filter (where secs >= 30 and secs < 180) as b2,
      count(*) filter (where secs >= 180 and secs < 300) as b3,
      count(*) filter (where secs >= 300) as b4
    from d`);
  const row = rows[0] ?? {};
  return { under30: n(row.b1), min1to3: n(row.b2), min3to5: n(row.b3), over5: n(row.b4) };
}

// key önekiyle tıklama dökümü (header:, footer:, floatbar:, galeri: ...)
export async function getKeyBreakdown(prefix: string, r: Range, limit = 12) {
  const rows = await exec(sql`
    select e.key, max(e.label) as label, count(*) as clicks, count(distinct e.visitor_id) as u
    from analytics_events e
    where e.type = 'click' and e.key like ${prefix + "%"} and ${inRange(r)}
    group by e.key
    order by clicks desc
    limit ${limit}`);
  return rows.map((row) => ({
    key: String(row.key),
    label: String(row.label ?? row.key),
    clicks: n(row.clicks),
    visitors: n(row.u),
  }));
}

// Aynı key'in etiket bazında dökümü (ör. galeri:foto → görsel adları)
export async function getLabelBreakdown(key: string, r: Range, limit = 10) {
  const rows = await exec(sql`
    select e.label, count(*) as clicks
    from analytics_events e
    where e.type = 'click' and e.key = ${key} and e.label is not null and ${inRange(r)}
    group by e.label
    order by clicks desc
    limit ${limit}`);
  return rows.map((row) => ({ label: String(row.label), clicks: n(row.clicks) }));
}

// ---------- Sayfa bazlı ----------

// pattern: Postgres regex ('^/egitimler/[^/]+$' gibi) — sayfa görüntülenmeleri
export async function getPathCounts(pattern: string, r: Range, limit = 20) {
  const rows = await exec(sql`
    select e.path, count(*) as views, count(distinct e.visitor_id) as u
    from analytics_events e
    where e.type = 'pageview' and e.path ~ ${pattern} and ${inRange(r)}
    group by e.path
    order by views desc
    limit ${limit}`);
  return rows.map((row) => ({
    path: String(row.path),
    views: n(row.views),
    visitors: n(row.u),
  }));
}

export async function getPageVisitors(pattern: string, r: Range) {
  const rows = await exec(sql`
    select count(distinct e.visitor_id) as u
    from analytics_events e
    where e.type = 'pageview' and e.path ~ ${pattern} and ${inRange(r)}`);
  return n(rows[0]?.u);
}

// Belirli sayfa yolunda anahtar kümesine dokunan ziyaretçi sayısı
export async function getCountOn(
  pathPattern: string,
  keyLike: string,
  types: string[],
  r: Range
) {
  const typeList = sql.join(
    types.map((t) => sql`${t}`),
    sql`, `
  );
  const rows = await exec(sql`
    select count(distinct e.visitor_id) as u
    from analytics_events e
    where e.type in (${typeList}) and e.key like ${keyLike}
      and e.path ~ ${pathPattern} and ${inRange(r)}`);
  return n(rows[0]?.u);
}

export async function getSectionStats(path: string, r: Range) {
  const rows = await exec(sql`
    select e.key, max(e.label) as label,
      count(distinct e.visitor_id) filter (where e.type = 'section_view') as reached,
      coalesce(sum(e.value) filter (where e.type = 'section_dwell'), 0) as total_secs
    from analytics_events e
    where e.path = ${path} and e.type in ('section_view', 'section_dwell') and ${inRange(r)}
    group by e.key
    order by reached desc`);
  return rows.map((row) => ({
    key: String(row.key),
    label: String(row.label ?? row.key),
    reached: n(row.reached),
    totalSecs: n(row.total_secs),
  }));
}

export async function getTopClicksOn(path: string, r: Range, limit = 6) {
  const rows = await exec(sql`
    select e.key, max(e.label) as label, count(*) as clicks
    from analytics_events e
    where e.type = 'click' and e.path = ${path}
      and (e.key like 'link:%' or e.key like 'header:%' or e.key like 'home:%')
      and ${inRange(r)}
    group by e.key
    order by clicks desc
    limit ${limit}`);
  return rows.map((row) => ({
    key: String(row.key),
    label: String(row.label ?? row.key),
    clicks: n(row.clicks),
  }));
}

// Sayfada ortalama kalış (page_dwell)
export async function getPageDwell(pattern: string, r: Range) {
  const rows = await exec(sql`
    select count(distinct e.visitor_id) as u, coalesce(sum(e.value), 0) as total_secs
    from analytics_events e
    where e.type = 'page_dwell' and e.path ~ ${pattern} and ${inRange(r)}`);
  const row = rows[0] ?? {};
  return { visitors: n(row.u), totalSecs: n(row.total_secs) };
}

// ---------- İsim haritaları (yol → başlık) ----------

export async function getTitleMaps() {
  const [cats, trns, posts, notes, members] = await Promise.all([
    db.select({ slug: categories.slug, name: categories.shortName }).from(categories),
    db
      .select({
        slug: trainings.slug,
        cat: categories.slug,
        title: trainings.title,
      })
      .from(trainings)
      .innerJoin(categories, eq(trainings.categoryId, categories.id)),
    db.select({ slug: blogPosts.slug, title: blogPosts.title }).from(blogPosts),
    db.select({ slug: brandNotes.slug, company: brandNotes.company }).from(brandNotes),
    db.select({ slug: teamMembers.slug, name: teamMembers.name }).from(teamMembers),
  ]);
  return {
    category: new Map(cats.map((c) => [`/egitimler/${c.slug}`, c.name])),
    training: new Map(trns.map((t) => [`/egitimler/${t.cat}/${t.slug}`, t.title])),
    blog: new Map(posts.map((p) => [`/blog/${p.slug}`, p.title])),
    note: new Map(notes.map((b) => [`/egitim-notlari/${b.slug}`, b.company])),
    member: new Map(
      members.filter((m) => m.slug).map((m) => [`/ekibimiz/${m.slug}`, m.name])
    ),
  };
}

// ---------- Ziyaretçiler ----------

export async function getVisitors(limit = 30) {
  return db
    .select()
    .from(analyticsVisitors)
    .orderBy(desc(analyticsVisitors.lastSeenAt))
    .limit(limit);
}

export async function getVisitorEvents(visitorId: number, limit = 150) {
  return db
    .select()
    .from(analyticsEvents)
    .where(eq(analyticsEvents.visitorId, visitorId))
    .orderBy(desc(analyticsEvents.createdAt))
    .limit(limit);
}
