import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Galeri" };

export default function GaleriPage() {
  return (
    <ComingSoon
      title="Galeri"
      text="Eğitim ve etkinliklerden kareler bu bölümde paylaşılacak."
      icon="layers"
    />
  );
}
