import Link from "next/link";
import Icon from "@/components/Icon";
import NavLink from "./NavLink";
import { logout } from "@/app/admin/(panel)/actions";
import type { SessionUser } from "@/lib/auth/session";

type NavEntry = { href: string; label: string; icon: string; adminOnly?: boolean };

const NAV: NavEntry[] = [
  { href: "/admin", label: "Genel Bakış", icon: "chart" },
  { href: "/admin/talepler", label: "Talepler", icon: "mail", adminOnly: true },
  { href: "/admin/egitimler", label: "Eğitimler", icon: "book" },
  { href: "/admin/blog", label: "Blog", icon: "megaphone" },
  { href: "/admin/egitim-notlari", label: "Eğitim Notları", icon: "layers" },
  { href: "/admin/galeri", label: "Galeri", icon: "sparkle" },
  { href: "/admin/ekip", label: "Ekip", icon: "users" },
  { href: "/admin/referanslar", label: "Referanslar", icon: "shield" },
  { href: "/admin/yasal", label: "Yasal Sayfalar", icon: "check-circle" },
  { href: "/admin/smtp-formlar", label: "SMTP & Formlar", icon: "wrench", adminOnly: true },
  { href: "/admin/cerez", label: "Çerez Yönetimi", icon: "target", adminOnly: true },
  { href: "/admin/iletisim-bari", label: "İletişim Barı", icon: "phone", adminOnly: true },
  { href: "/admin/kod-ekleme", label: "Kod Ekleme", icon: "cpu", adminOnly: true },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: "cog", adminOnly: true },
];

export default function Sidebar({ user }: { user: SessionUser }) {
  const items = NAV.filter((n) => !n.adminOnly || user.role === "admin");

  return (
    <aside className="adm-sidebar">
      <div className="adm-sidebar-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Ali Özel" />
        <span>Yönetim Paneli</span>
      </div>
      <nav className="adm-nav">
        {items.map((n) => (
          <NavLink key={n.href} href={n.href}>
            <Icon name={n.icon} />
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="adm-sidebar-foot">
        <Link href="/" target="_blank" className="adm-view-site">
          <Icon name="arrow-up-right" />
          Siteyi görüntüle
        </Link>
        <div className="adm-user">
          <Link href="/admin/hesabim" className="adm-user-info" title="Hesap ayarları">
            <strong>{user.name}</strong>
            <span>{user.role === "admin" ? "Yönetici" : "Editör"}</span>
          </Link>
          <form action={logout}>
            <button type="submit" className="adm-logout" title="Çıkış yap">
              <Icon name="close" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
