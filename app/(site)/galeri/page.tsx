import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import CTA from "@/components/CTA";
import ComingSoon from "@/components/ComingSoon";
import GalleryTabs from "@/components/GalleryTabs";
import { getGallery } from "@/lib/data/gallery";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Eğitimlerden, atölyelerden ve saha çalışmalarından kareler.",
};

export default async function GaleriPage() {
  const sections = await getGallery();
  const hasImages = sections.some((s) => s.images.length > 0);

  if (!hasImages) {
    return (
      <ComingSoon
        title="Galeri"
        text="Eğitim ve etkinliklerden kareler bu bölümde paylaşılacak."
        icon="layers"
      />
    );
  }

  return (
    <>
      <section className="page-hero on-brand">
        <div className="container">
          <Breadcrumb items={[{ label: "Galeri" }]} />
          <span className="badge">
            <Icon name="layers" style={{ width: 16, height: 16 }} />
            Galeri
          </span>
          <h1>Sahadan kareler</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <GalleryTabs sections={sections.filter((s) => s.images.length > 0)} />
        </div>
      </section>

      <CTA />
    </>
  );
}
