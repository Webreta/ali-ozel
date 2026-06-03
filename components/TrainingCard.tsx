import Link from "next/link";
import type { Training } from "@/lib/content";
import Icon from "./Icon";

export default function TrainingCard({
  training,
  index,
  categorySlug,
}: {
  training: Training;
  index: number;
  categorySlug: string;
}) {
  const num = String(index + 1).padStart(2, "0");
  const href = `/egitimler/${categorySlug}/${training.slug}`;
  const body = (
    <>
      <span className="tc-num">{num}</span>
      <div className="tc-body">
        <h4>{training.title}</h4>
        <p>{training.blurb}</p>
        {training.page ? (
          <span className="tc-cta">
            Detayları gör <Icon name="arrow-right" />
          </span>
        ) : (
          <span className="tc-soon">Detaylı sayfa yakında</span>
        )}
      </div>
    </>
  );

  if (training.page) {
    return (
      <Link href={href} className="training-card">
        {body}
      </Link>
    );
  }
  return <div className="training-card">{body}</div>;
}
