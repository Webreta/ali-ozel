"use client";

export default function ConfirmDelete({
  action,
  label = "Sil",
  confirmText = "Bu kayıt kalıcı olarak silinecek. Emin misiniz?",
}: {
  action: () => Promise<void>;
  label?: string;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
      style={{ display: "inline" }}
    >
      <button type="submit" className="btn btn-outline adm-danger-btn">
        {label}
      </button>
    </form>
  );
}
