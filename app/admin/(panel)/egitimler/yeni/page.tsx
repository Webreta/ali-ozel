import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import CategoryForm from "../CategoryForm";
import { createCategory } from "../actions";

export const metadata: Metadata = { title: "Yeni Kategori" };

export default async function YeniKategoriPage() {
  await requireUser();
  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Yeni kategori</h1>
        </div>
      </div>
      <div className="adm-card">
        <CategoryForm action={createCategory} />
      </div>
    </>
  );
}
