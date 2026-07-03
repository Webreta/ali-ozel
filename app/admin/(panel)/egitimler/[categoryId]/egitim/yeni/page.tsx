import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import TrainingForm from "../../../TrainingForm";
import { createTraining } from "../../../actions";

export const metadata: Metadata = { title: "Yeni Eğitim" };

export default async function YeniEgitimPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  await requireUser();
  const { categoryId } = await params;
  const id = Number(categoryId);
  if (!Number.isInteger(id)) notFound();

  const [cat] = await db
    .select({ name: categories.name })
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  if (!cat) notFound();

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Yeni eğitim</h1>
          <p>{cat.name}</p>
        </div>
      </div>
      <div className="adm-card">
        <TrainingForm action={createTraining.bind(null, id)} />
      </div>
    </>
  );
}
