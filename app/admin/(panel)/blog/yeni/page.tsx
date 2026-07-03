import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import BlogForm from "../BlogForm";
import { createPost } from "../actions";

export const metadata: Metadata = { title: "Yeni Blog Yazısı" };

export default async function YeniYaziPage() {
  await requireUser();
  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Yeni blog yazısı</h1>
        </div>
      </div>
      <div className="adm-card">
        <BlogForm action={createPost} />
      </div>
    </>
  );
}
