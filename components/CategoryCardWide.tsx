import Link from "next/link";
import type { Category } from "@/lib/content";
import Icon from "./Icon";

export default function CategoryCardWide({ category }: { category: Category }) {
  return (
    <Link href={`/egitimler/${category.slug}`} className="cat-card-wide">
      <span className="ccw-icon">
        <Icon name={category.icon} />
      </span>
      <span className="ccw-body">
        <span className="ccw-kicker">{category.tagline}</span>
        <h3>{category.name}</h3>
        <span className="ccw-desc">{category.summary}</span>
        <span className="ccw-foot">
          <span className="count">{category.trainings.length} eğitim modülü</span>
          <span className="ccw-arrow">
            İncele <Icon name="arrow-right" />
          </span>
        </span>
      </span>
    </Link>
  );
}
