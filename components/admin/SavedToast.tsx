"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Kaydet action'ları listeye `?saved=1` ile döner; bu bileşen bir kez
 * "Kaydedildi" gösterir ve parametreyi URL'den temizler.
 */
export default function SavedToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const saved = searchParams.get("saved");

  useEffect(() => {
    if (!saved) return;
    setVisible(true);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("saved");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    const t = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved, pathname]);

  if (!visible) return null;
  return (
    <div className="adm-toast" role="status">
      ✓ Kaydedildi
    </div>
  );
}
