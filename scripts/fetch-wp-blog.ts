/**
 * Eski WordPress sitesinden (aliozel.com.tr) son 14 blog yazısını çeker,
 * HTML'i markdown'a çevirir, gömülü görselleri public/blog/ altına webp
 * olarak indirir ve db/blog-content/posts.json üretir.
 *
 * Tek seferlik taşıma scripti; çıktısı versiyonlanır, DB'ye yükleme
 * `npm run db:import-blog` ile yapılır.
 *
 *   npx tsx scripts/fetch-wp-blog.ts
 */
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import sharp from "sharp";

const WP_API = "https://aliozel.com.tr/wp-json/wp/v2/posts?per_page=14&orderby=date&order=desc";
const IMG_DIR = path.resolve("public/blog");
const OUT_DIR = path.resolve("db/blog-content");

type WpPost = {
  slug: string;
  date_gmt: string;
  featured_media: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
};

const ENTITIES: Record<string, string> = {
  "&#8217;": "’",
  "&#8216;": "‘",
  "&#8220;": "“",
  "&#8221;": "”",
  "&#8211;": "–",
  "&#8212;": "—",
  "&#8230;": "…",
  "&hellip;": "…",
  "&#038;": "&",
  "&amp;": "&",
  "&nbsp;": " ",
  "&#160;": " ",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
};

function decodeEntities(s: string): string {
  for (const [k, v] of Object.entries(ENTITIES)) s = s.split(k).join(v);
  // kalan sayısal entity'ler
  s = s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
  return s;
}

function numberOl(inner: string): string {
  let i = 0;
  return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, li) => {
    i++;
    return `${i}. ${li.trim()}\n`;
  });
}

/** WordPress gövde HTML'ini markdown'a çevirir. img'ler önceden değiştirilmiş olmalı. */
function htmlToMarkdown(html: string): string {
  let h = html;
  h = h.replace(/<!--[\s\S]*?-->/g, "");
  h = h.replace(/\r?\n/g, " ");

  // inline biçimler
  h = h.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_, _t, x) => {
    const inner = x.trim();
    return inner ? `**${inner}**` : "";
  });
  h = h.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, (_, _t, x) => {
    const inner = x.trim();
    return inner ? `*${inner}*` : "";
  });
  h = h.replace(
    /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, text) => {
      const t = text.replace(/<[^>]+>/g, "").trim();
      return t ? `[${t}](${href})` : href;
    }
  );

  // listeler
  h = h.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => `\n${numberOl(inner)}\n`);
  h = h.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, li) => `- ${li.trim()}\n`);
  h = h.replace(/<\/?ul[^>]*>/gi, "\n");

  // blockquote: içindeki paragrafları > ile başlat
  h = h.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
    const text = inner
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n")
      .replace(/<[^>]+>/g, "")
      .trim();
    const quoted = text
      .split("\n")
      .filter((l: string) => l.trim())
      .map((l: string) => `> ${l.trim()}`)
      .join("\n>\n");
    return `\n${quoted}\n\n`;
  });

  // başlıklar (h1 içerikte başlık hiyerarşisi bozuk gelebiliyor → h2'ye indir)
  h = h.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, x) => `\n## ${x.trim()}\n\n`);
  h = h.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, x) => `\n## ${x.trim()}\n\n`);
  h = h.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, x) => `\n### ${x.trim()}\n\n`);
  h = h.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, x) => `\n### ${x.trim()}\n\n`);

  h = h.replace(/<br\s*\/?>/gi, "\n");
  h = h.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, x) => `${x.trim()}\n\n`);

  // kalan tüm etiketleri at
  h = h.replace(/<[^>]+>/g, "");

  h = decodeEntities(h);
  // kaynaktan gelen bitişik link yazımları: "kelime[Link](...)" → "kelime [Link](...)"
  h = h.replace(/([0-9A-Za-zÇĞİÖŞÜçğıöşü,;’])\[(?!\])/g, "$1 [");
  // satır sonu boşlukları ve 2+ boş satırı toparla
  h = h
    .split("\n")
    .map((l) => l.replace(/\s+$/g, "").replace(/^[ \t]+/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return h;
}

function cleanExcerpt(html: string): string {
  const text = decodeEntities(
    html.replace(/<[^>]+>/g, "").replace(/\[&hellip;\]|\[…\]|\[\.\.\.\]/g, "…")
  )
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 220 ? text.slice(0, 217).trimEnd() + "…" : text;
}

async function downloadImage(src: string, outBase: string): Promise<string | null> {
  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const outName = `${outBase}.webp`;
    await sharp(buf)
      .rotate() // EXIF yönünü uygula (telefon fotoğrafları yan kalmasın)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(IMG_DIR, outName));
    return `/blog/${outName}`;
  } catch (e) {
    console.warn(`  ! görsel indirilemedi: ${src} (${(e as Error).message})`);
    return null;
  }
}

async function main() {
  mkdirSync(IMG_DIR, { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const res = await fetch(WP_API);
  if (!res.ok) throw new Error(`WP API: HTTP ${res.status}`);
  const posts = (await res.json()) as WpPost[];

  const out: {
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    publishedAt: string;
    coverImage: string | null;
  }[] = [];

  for (const p of posts) {
    console.log(`→ ${p.slug}`);
    let html = p.content.rendered;

    // görseller: indir, markdown'a çevir (link sarmalayıcıyı da soy)
    let imgIdx = 0;
    const imgTags = [...html.matchAll(/<img[^>]*>/gi)].map((m) => m[0]);
    for (const tag of imgTags) {
      const src = tag.match(/src="([^"]+)"/)?.[1];
      const alt = tag.match(/alt="([^"]*)"/)?.[1] || "";
      let md = "";
      if (src) {
        imgIdx++;
        // WP thumbnail'ı değil orijinal dosyayı dene (-300x225 gibi ekleri soy)
        const fullSrc = src.replace(/-\d+x\d+(\.\w+)$/, "$1");
        const local =
          (await downloadImage(fullSrc, `${p.slug}-${imgIdx}`)) ||
          (fullSrc !== src
            ? await downloadImage(src, `${p.slug}-${imgIdx}`)
            : null);
        if (local) md = `![${alt}](${local})`;
      }
      // <a href><img></a> → sadece görsel
      const wrapped = new RegExp(
        `<a[^>]*>\\s*${tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*</a>`,
        "i"
      );
      if (wrapped.test(html)) html = html.replace(wrapped, `\n${md}\n`);
      else html = html.replace(tag, `\n${md}\n`);
    }

    // kapak: WP'deki öne çıkan görselin tam boyutlusu
    let coverImage: string | null = null;
    if (p.featured_media) {
      const mres = await fetch(
        `https://aliozel.com.tr/wp-json/wp/v2/media/${p.featured_media}?_fields=source_url`
      );
      if (mres.ok) {
        const media = (await mres.json()) as { source_url?: string };
        if (media.source_url) {
          coverImage = await downloadImage(media.source_url, `kapak-${p.slug}`);
        }
      }
    }

    out.push({
      slug: p.slug,
      title: decodeEntities(p.title.rendered).trim(),
      excerpt: cleanExcerpt(p.excerpt.rendered),
      body: htmlToMarkdown(html),
      publishedAt: p.date_gmt + "Z",
      coverImage,
    });
  }

  writeFileSync(
    path.join(OUT_DIR, "posts.json"),
    JSON.stringify(out, null, 2) + "\n",
    "utf8"
  );
  console.log(`✓ ${out.length} yazı → db/blog-content/posts.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
