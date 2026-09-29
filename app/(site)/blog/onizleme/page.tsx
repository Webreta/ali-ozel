import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import BlogPreview from "./BlogPreview";

export const metadata: Metadata = {
  title: "Yazı Önizleme",
  robots: { index: false, follow: false },
};

// Panelden "Önizle" ile açılır; içerik tarayıcıdan (localStorage) okunur,
// yazı kaydedilmemiş/yayınlanmamış olsa bile sitedeki görünümü gösterir.
export default async function BlogOnizlemePage() {
  await requireUser();
  return <BlogPreview />;
}
