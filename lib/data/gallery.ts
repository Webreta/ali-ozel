import "server-only";
import { unstable_cache } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { gallerySections } from "@/db/schema";

export type GallerySectionData = {
  id: number;
  title: string;
  layout: "grid" | "masonry";
  columns: number;
  images: { src: string; alt: string | null }[];
};

/**
 * Public /galeri sayfasının bölümleri (tab'ları). Tag bazlı cache:
 * admin kaydettiğinde revalidateTag("gallery") tazeler.
 */
export const getGallery = unstable_cache(
  async (): Promise<GallerySectionData[]> => {
    const rows = await db.query.gallerySections.findMany({
      where: eq(gallerySections.published, true),
      orderBy: [asc(gallerySections.sortOrder), asc(gallerySections.id)],
      with: {
        images: {
          orderBy: (i, { asc: a }) => [a(i.sortOrder), a(i.id)],
        },
      },
    });
    return rows.map((s) => ({
      id: s.id,
      title: s.title,
      layout: s.layout,
      columns: s.columns,
      images: s.images.map((i) => ({ src: i.src, alt: i.alt })),
    }));
  },
  ["gallery"],
  { tags: ["gallery"] }
);
