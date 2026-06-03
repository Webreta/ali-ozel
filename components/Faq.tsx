import type { FaqItem } from "@/lib/content";
import Icon from "./Icon";

export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <details className="faq-item" key={i}>
          <summary className="faq-q">
            {item.q}
            <span className="fq-icon">
              <Icon name="plus" />
            </span>
          </summary>
          <div className="faq-a">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
