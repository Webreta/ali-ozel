import Link from "next/link";
import { Fragment } from "react";

type Crumb = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumb" aria-label="Sayfa yolu">
      <Link href="/">Ana Sayfa</Link>
      {items.map((item, i) => (
        <Fragment key={i}>
          <span className="sep">/</span>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className="current">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
