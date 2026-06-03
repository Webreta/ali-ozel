import Link from "next/link";
import type { Category } from "@/lib/content";
import Icon from "./Icon";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/egitimler/${category.slug}`} className="cat-card">
      <span className="card-icon">
        <Icon name={category.icon} />
      </span>
      <p className="cat-tagline">{category.tagline}</p>
      <h3>{category.name}</h3>
      <p>{category.summary}</p>
      <div className="cat-meta">
        <span className="count">{category.trainings.length} modül</span>
        <span className="go">
          İncele <Icon name="arrow-right" />
        </span>
      </div>
    </Link>
  );
}
