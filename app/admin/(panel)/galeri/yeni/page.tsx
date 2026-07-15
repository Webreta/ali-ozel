import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import SectionForm from "../SectionForm";
import { createSection } from "../actions";

export const metadata: Metadata = { title: "Yeni Galeri Bölümü" };

export default async function YeniBolumPage() {
  await requireUser();
  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Yeni galeri bölümü</h1>
          <p>Bölüm, galeri sayfasında yeni bir tab olarak görünür.</p>
        </div>
      </div>
      <div className="adm-card">
        <SectionForm action={createSection} />
      </div>
    </>
  );
}
