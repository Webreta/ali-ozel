import Link from "next/link";
import type { Training } from "@/lib/content";
import Icon from "./Icon";

export default function TrainingCard({
  training,
  number,
  categorySlug,
}: {
  training: Training;
  number: number;
  categorySlug: string;
}) {
  const href = training.page
    ? `/egitimler/${categorySlug}/${training.slug}`
    : "#";
  return (
    <Link href={href} className="training-card">
      <span className="tc-icon tc-num">{number}</span>
      <div className="tc-body">
        <h4>{training.title}</h4>
        <p>{training.blurb}</p>
        <span className="tc-cta">
          Detayları gör <Icon name="arrow-right" />
        </span>
      </div>
    </Link>
  );
}
