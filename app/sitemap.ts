import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/data/catalog";
import { getPublishedPosts } from "@/lib/data/blog";
import { getTeam } from "@/lib/data/team";

// Runtime'da DB'den üretilir; build sırasında (DB erişilemezken) prerender
// denenmesin. DB hatası olursa yalnızca statik sayfalar döner (build bozulmaz).
export const dynamic = "force-dynamic";

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sanegitim.com"
).replace(/\/+$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Sabit (herkese açık) sayfalar. /admin ve /egitim-notlari robots'ta engelli,
  // /yasal sayfaları noindex olduğundan sitemap'e alınmaz.
  const staticPaths: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/egitimler", priority: 0.8 },
    { path: "/ekibimiz", priority: 0.6 },
    { path: "/blog", priority: 0.7 },
    { path: "/referanslar", priority: 0.5 },
    { path: "/galeri", priority: 0.5 },
    { path: "/farkimiz-ne", priority: 0.6 },
    { path: "/iletisim", priority: 0.6 },
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${BASE}${p.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p.priority,
  }));

  // Eğitim kategorileri + eğitimler
  try {
    const categories = await getCatalog();
    for (const c of categories) {
      entries.push({
        url: `${BASE}/egitimler/${c.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
      for (const t of c.trainings) {
        entries.push({
          url: `${BASE}/egitimler/${c.slug}/${t.slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // DB yoksa sessiz geç — statik sayfalarla yetin.
  }

  // Blog yazıları
  try {
    const posts = await getPublishedPosts();
    for (const p of posts) {
      entries.push({
        url: `${BASE}/blog/${p.slug}`,
        lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    /* yut */
  }

  // Detay sayfası olan ekip üyeleri
  try {
    const team = await getTeam();
    for (const m of team) {
      if (m.slug && m.detailBio) {
        entries.push({
          url: `${BASE}/ekibimiz/${m.slug}`,
          lastModified: m.updatedAt ?? now,
          changeFrequency: "yearly",
          priority: 0.4,
        });
      }
    }
  } catch {
    /* yut */
  }

  return entries;
}
