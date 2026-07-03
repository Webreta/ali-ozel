import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import CTA from "@/components/CTA";
import { getReferences } from "@/lib/data/references";

export const metadata: Metadata = {
  title: "Referanslar",
  description:
    "Üretimden sağlığa, teknolojiden hizmete; birlikte çalıştığımız önde gelen kurumlar.",
};

export default async function ReferanslarPage() {
  const references = await getReferences();
  return (
    <>
      <section className="page-hero on-brand">
        <div className="container">
          <Breadcrumb items={[{ label: "Referanslar" }]} />
          <span className="badge">
            <Icon name="shield" style={{ width: 16, height: 16 }} />
            Referanslar
          </span>
          <h1>Bize güvenen kurumlar</h1>
          <p className="page-lead">
            Üretimden sağlığa, teknolojiden hizmete; sektörün önde gelen
            kurumlarıyla sahada, gerçek ekiplerle çalıştık.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="ref-grid">
            {references.map((r) => (
              <div className="ref-cell" key={r.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.src} alt={r.name} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
