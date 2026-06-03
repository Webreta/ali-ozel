import Link from "next/link";
import Icon from "./Icon";
import TeklifButton from "./TeklifButton";

export default function CTA({
  title = "Kurumunuz için özel program planlayalım",
  text = "İhtiyaç analizinden başlayarak ekibinize ve sektörünüze özel, uygulamaya dönük bir eğitim programı tasarlıyoruz.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="section">
      <div className="container">
        <div className="cta">
          <h2>{title}</h2>
          <p>{text}</p>
          <div className="cta-actions">
            <TeklifButton className="btn btn-primary btn-lg">
              Teklif Talep Et
              <Icon name="arrow-right" />
            </TeklifButton>
            <Link href="/egitimler" className="btn btn-light btn-lg">
              Eğitimleri İncele
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
