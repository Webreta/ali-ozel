import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import ComingSoon from "@/components/ComingSoon";
import CTA from "@/components/CTA";
import { getPublishedPosts } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Liderlik, üretim sahası ve insan yönetimi üzerine yazılar.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  if (posts.length === 0) {
    return (
      <ComingSoon
        title="Blog Yazılarım"
        text="Liderlik, üretim sahası ve insan yönetimi üzerine yazılar çok yakında burada."
        icon="book"
      />
    );
  }

  return (
    <>
      <section className="page-hero on-brand">
        <div className="container">
          <Breadcrumb items={[{ label: "Blog" }]} />
          <span className="badge">
            <Icon name="book" style={{ width: 16, height: 16 }} />
            Blog
          </span>
          <h1>Blog Yazılarım</h1>
          <p className="page-lead">
            Liderlik, üretim sahası ve insan yönetimi üzerine sahadan beslenen
            yazılar.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {posts.map((p) => (
              <Link href={`/blog/${p.slug}`} className="blog-card" key={p.id}>
                {p.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.coverImage} alt="" className="blog-card-img" />
                ) : (
                  <div className="blog-card-img blog-card-img-empty">
                    <Icon name="book" />
                  </div>
                )}
                <div className="blog-card-body">
                  {p.publishedAt ? (
                    <span className="blog-card-date">
                      {new Date(p.publishedAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  ) : null}
                  <h2>{p.title}</h2>
                  {p.excerpt ? <p>{p.excerpt}</p> : null}
                  <span className="blog-card-more">
                    Devamını oku <Icon name="arrow-right" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
