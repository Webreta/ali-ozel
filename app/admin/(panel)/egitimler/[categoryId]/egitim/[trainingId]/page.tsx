import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, trainings, trainingPages } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import TrainingForm from "../../../TrainingForm";
import { updateTraining } from "../../../actions";

export const metadata: Metadata = { title: "Eğitimi Düzenle" };

export default async function EgitimDuzenlePage({
  params,
}: {
  params: Promise<{ categoryId: string; trainingId: string }>;
}) {
  await requireUser();
  const { trainingId } = await params;
  const id = Number(trainingId);
  if (!Number.isInteger(id)) notFound();

  const [row] = await db
    .select()
    .from(trainings)
    .leftJoin(trainingPages, eq(trainingPages.trainingId, trainings.id))
    .leftJoin(categories, eq(categories.id, trainings.categoryId))
    .where(eq(trainings.id, id))
    .limit(1);
  if (!row?.trainings || !row.categories) notFound();

  const t = row.trainings;
  const p = row.training_pages;
  const cat = row.categories;

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>{t.title}</h1>
          <p>
            /egitimler/{cat.slug}/{t.slug}
            {" · "}
            <Link
              href={`/egitimler/${cat.slug}/${t.slug}`}
              target="_blank"
              className="adm-row-link"
              style={{ display: "inline" }}
            >
              Sitede gör ↗
            </Link>
          </p>
        </div>
      </div>
      <div className="adm-card">
        <TrainingForm
          action={updateTraining.bind(null, t.id)}
          initialData={{
            title: t.title,
            blurb: t.blurb,
            published: t.published,
            page: p
              ? {
                  seoTitle: p.seoTitle,
                  seoDescription: p.seoDescription,
                  heroQuote: p.heroQuote,
                  audience: p.audience,
                  intro: p.intro,
                  sections: p.sections,
                  outcomes: p.outcomes,
                  format: p.format,
                  faq: p.faq,
                }
              : null,
          }}
        />
      </div>
    </>
  );
}
