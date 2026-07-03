import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import NoteAccessForm from "@/components/NoteAccessForm";

export const metadata: Metadata = {
  title: "Eğitim Notları",
  description:
    "Eğitime katılanlara özel; size verilen erişim koduyla eğitim notlarınızı, sunum ve materyallerinizi görüntüleyin.",
};

const logos = [
  "/referanslar/vestel.png",
  "/referanslar/mondi.png",
  "/referanslar/baticim.png",
  "/referanslar/grundfos.png",
  "/referanslar/medtronic.png",
  "/referanslar/telcoset.png",
];

export default async function EgitimNotlariPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const { denied } = await searchParams;
  return (
    <>
      <section className="page-hero on-brand">
        <div className="container">
          <Breadcrumb items={[{ label: "Eğitim Notları" }]} />
          <span className="badge">
            <Icon name="book" style={{ width: 16, height: 16 }} />
            Eğitim Notları
          </span>
          <h1>Eğitime özel notlar ve materyaller</h1>
          <p className="page-lead">
            Katıldığınız programa ait notlara, sunumlara ve uygulama
            materyallerine; eğitim sonunda size verilen erişim koduyla
            ulaşabilirsiniz.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="access-box">
            <span className="access-ic">
              <Icon name="book" />
            </span>
            <h2>Eğitim notunuzu görüntüleyin</h2>
            <p>
              Size verilen erişim kodunu girin; programınıza özel notlar,
              materyaller ve galeri açılsın.
            </p>
            {denied ? (
              <p className="access-error" role="alert">
                Bu sayfa erişim koduyla korunuyor — lütfen kodunuzu girin.
              </p>
            ) : null}
            <NoteAccessForm />
          </div>

          <div className="access-logos">
            <span>Notları hazır kurumlardan bazıları</span>
            <div className="access-logos-row">
              {logos.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" key={src} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
