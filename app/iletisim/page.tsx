import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import ContactForm from "@/components/ContactForm";
import Icon from "@/components/Icon";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim & Teklif",
  description:
    "Kurumunuza özel liderlik ve yönetim eğitimi için teklif alın. Ali Özel San Eğitim & Danışmanlık ile iletişime geçin.",
};

const items = [
  {
    icon: "phone",
    label: "Telefon",
    value: site.contact.phone,
    href: site.contact.phoneHref,
  },
  {
    icon: "mail",
    label: "E-posta",
    value: site.contact.email,
    href: site.contact.emailHref,
  },
  { icon: "pin", label: "Konum", value: site.contact.location },
];

export default function IletisimPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumb items={[{ label: "İletişim" }]} />
          <h1>Kurumunuz için teklif alın</h1>
          <p className="page-lead">
            İhtiyacınızı paylaşın; size özel, uygulamaya dönük bir eğitim
            programı tasarlayalım. En kısa sürede dönüş yapıyoruz.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div>
            <span className="eyebrow">Bize ulaşın</span>
            <h2 className="section-title">Konuşmaya hazırız</h2>
            <p className="section-desc" style={{ marginBottom: 12 }}>
              İster telefon, ister e-posta; en rahat ettiğiniz kanaldan bize
              ulaşabilirsiniz.
            </p>
            <div style={{ marginTop: 20 }}>
              {items.map((it) => {
                const content = (
                  <>
                    <span className="ci-icon">
                      <Icon name={it.icon} />
                    </span>
                    <div>
                      <div className="ci-label">{it.label}</div>
                      <div className="ci-value">{it.value}</div>
                    </div>
                  </>
                );
                return it.href ? (
                  <a className="contact-item" href={it.href} key={it.label}>
                    {content}
                  </a>
                ) : (
                  <div className="contact-item" key={it.label}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
