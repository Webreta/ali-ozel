import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <ComingSoon
      title="Blog Yazılarım"
      text="Liderlik, üretim sahası ve insan yönetimi üzerine yazılar çok yakında burada."
    />
  );
}
