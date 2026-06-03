import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import CategoryCard from "@/components/CategoryCard";
import CTA from "@/components/CTA";
import { categories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Eğitimler",
  description:
    "Yönetim, lider mühendis, mavi & gri yaka, satış, takım çalışması, turizm ve yapay zekâ alanlarında kurumsal eğitim programları.",
};

const moduleCount = categories.reduce((n, c) => n + c.trainings.length, 0);

export default function EgitimlerPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumb items={[{ label: "Eğitimler" }]} />
          <h1>Eğitim Programları</h1>
          <p className="page-lead">
            {categories.length} ana alan, {moduleCount}+ modül. Her program;
            kurumunuzun sektörüne, kültürüne ve gerçek ihtiyaçlarına göre
            uyarlanır.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {categories.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
