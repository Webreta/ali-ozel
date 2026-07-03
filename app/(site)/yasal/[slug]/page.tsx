import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { eq } from "drizzle-orm";
import Breadcrumb from "@/components/Breadcrumb";
import { db } from "@/db";
import { legalPages } from "@/db/schema";

export const dynamicParams = true;

const getLegalPage = (slug: string) =>
  unstable_cache(
    () =>
      db
        .select()
        .from(legalPages)
        .where(eq(legalPages.slug, slug))
        .limit(1)
        .then((rows) => rows[0] ?? null),
    ["legal-page", slug],
    { tags: ["legal"] }
  )();

export async function generateStaticParams() {
  const rows = await db.select({ slug: legalPages.slug }).from(legalPages);
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLegalPage(slug);
  if (!page) return { title: "Sayfa bulunamadı" };
  return { title: page.title, robots: { index: false } };
}

export default async function YasalSayfaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getLegalPage(slug);
  if (!page) notFound();

  // Boş satır = paragraf; tek satır sonu paragraf içinde korunur
  const paragraphs: string[] = page.body
    .split(/\n\s*\n/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <>
      <section className="page-hero on-brand">
        <div className="container">
          <Breadcrumb items={[{ label: page.title }]} />
          <h1>{page.title}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container blog-post">
          <div className="prose">
            {paragraphs.map((p, i) => (
              <p key={i} style={{ whiteSpace: "pre-line" }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
