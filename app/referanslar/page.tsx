import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Referanslar" };

export default function ReferanslarPage() {
  return (
    <ComingSoon
      title="Referanslar"
      text="Birlikte çalıştığımız kurumlar ve katılımcı görüşleri çok yakında burada olacak."
      icon="shield"
    />
  );
}
