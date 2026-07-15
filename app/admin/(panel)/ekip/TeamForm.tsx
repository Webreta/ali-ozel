"use client";

import { useActionState } from "react";
import ImageField from "@/components/admin/ImageField";
import MarkdownField from "@/components/admin/MarkdownField";
import RepeatableList from "@/components/admin/RepeatableList";
import SubmitButton from "@/components/admin/SubmitButton";
import type { TeamFormState } from "./actions";

type HighlightRow = { label: string; value: string };

type Member = {
  name: string;
  roleTitle: string;
  bio: string;
  photo: string | null;
  initials: string | null;
  detailBio: string;
  expertise: string[];
  highlights: HighlightRow[];
  published: boolean;
};

export default function TeamForm({
  action,
  initialData,
}: {
  action: (prev: TeamFormState, formData: FormData) => Promise<TeamFormState>;
  initialData?: Member;
}) {
  const [state, formAction] = useActionState<TeamFormState, FormData>(
    action,
    {}
  );
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="adm-form">
      <div className="adm-form-row">
        <div className="adm-field">
          <label htmlFor="name">Ad Soyad</label>
          <input id="name" name="name" defaultValue={initialData?.name} required />
          {err.name ? <span className="adm-field-error">{err.name}</span> : null}
        </div>
        <div className="adm-field">
          <label htmlFor="roleTitle">Unvan</label>
          <input
            id="roleTitle"
            name="roleTitle"
            defaultValue={initialData?.roleTitle}
            placeholder="ör. Satış & İletişim Eğitmeni"
            required
          />
          {err.roleTitle ? (
            <span className="adm-field-error">{err.roleTitle}</span>
          ) : null}
        </div>
      </div>

      <div className="adm-field">
        <label htmlFor="bio">Tanıtım</label>
        <textarea id="bio" name="bio" defaultValue={initialData?.bio} required />
        {err.bio ? <span className="adm-field-error">{err.bio}</span> : null}
      </div>

      <div className="adm-form-row">
        <ImageField
          name="photo"
          label="Fotoğraf"
          defaultValue={initialData?.photo}
          hint="Fotoğraf yoksa aşağıdaki baş harfler gösterilir."
        />
        <div className="adm-field">
          <label htmlFor="initials">Baş harfler</label>
          <input
            id="initials"
            name="initials"
            defaultValue={initialData?.initials ?? ""}
            maxLength={4}
            placeholder="ör. AÖ"
          />
          <span className="adm-hint">Fotoğrafsız kartlarda görünür.</span>
        </div>
      </div>

      <fieldset className="adm-fieldset">
        <legend>Hakkında sayfası</legend>
        <span className="adm-hint" style={{ display: "block", marginBottom: 10 }}>
          Detaylı tanıtım doldurulursa üyenin /ekibimiz altında kendi
          &quot;Hakkında&quot; sayfası açılır; boş bırakılırsa kartta buton
          görünmez.
        </span>
        <MarkdownField
          name="detailBio"
          label="Detaylı tanıtım (markdown)"
          defaultValue={initialData?.detailBio ?? ""}
        />
        <div className="adm-field">
          <label htmlFor="expertise">
            Eğitim &amp; uzmanlık alanları (her satıra bir madde)
          </label>
          <textarea
            id="expertise"
            name="expertise"
            defaultValue={(initialData?.expertise ?? []).join("\n")}
            placeholder={"Liderlik\nSatış Becerileri\nEkip Yönetimi"}
          />
        </div>
        <div className="adm-field">
          <label>Öne çıkan sayılar</label>
          <RepeatableList<HighlightRow>
            name="highlights"
            addLabel="+ Satır ekle"
            initialItems={initialData?.highlights ?? []}
            empty={{ label: "", value: "" }}
            renderRow={(item, update) => (
              <div className="adm-form-row">
                <input
                  placeholder="Değer (ör. 21.000+)"
                  value={item.value}
                  onChange={(e) => update({ value: e.target.value })}
                />
                <input
                  placeholder="Etiket (ör. katılımcı)"
                  value={item.label}
                  onChange={(e) => update({ label: e.target.value })}
                />
              </div>
            )}
          />
        </div>
      </fieldset>

      <div className="adm-field">
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            name="published"
            defaultChecked={initialData?.published ?? true}
            style={{ width: "auto" }}
          />
          Sitede yayınla
        </label>
      </div>

      {state.error ? <p className="adm-form-error">{state.error}</p> : null}

      <div className="adm-form-actions">
        <SubmitButton>Kaydet</SubmitButton>
      </div>
    </form>
  );
}
