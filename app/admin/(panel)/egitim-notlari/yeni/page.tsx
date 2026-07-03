import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import BrandNoteForm from "../BrandNoteForm";
import { createNote } from "../actions";

export const metadata: Metadata = { title: "Yeni Eğitim Notu" };

export default async function YeniNotPage() {
  await requireUser();
  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Yeni eğitim notu sayfası</h1>
          <p>Kaydedince erişim kodu ve materyalleri ekleyebilirsiniz.</p>
        </div>
      </div>
      <div className="adm-card">
        <BrandNoteForm action={createNote} />
      </div>
    </>
  );
}
