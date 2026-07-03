import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { legalPages } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import LegalForm from "../LegalForm";
import { updateLegalPage } from "../actions";

export const metadata: Metadata = { title: "Yasal Sayfayı Düzenle" };

export default async function YasalDuzenlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const [page] = await db
    .select()
    .from(legalPages)
    .where(eq(legalPages.id, numericId))
    .limit(1);
  if (!page) notFound();

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>{page.title}</h1>
          <p>
            /yasal/{page.slug}
            {" · "}
            <Link
              href={`/yasal/${page.slug}`}
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
        <LegalForm
          action={updateLegalPage.bind(null, page.id)}
          initialData={page}
          submitLabel="Kaydet"
        />
      </div>
    </>
  );
}
