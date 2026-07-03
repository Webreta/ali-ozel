import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marked } from "marked";
import Breadcrumb from "@/components/Breadcrumb";
import CTA from "@/components/CTA";
import { getPublishedPost, getPublishedPosts } from "@/lib/data/blog";

export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Yazı bulunamadı" };
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    openGraph: post.coverImage ? { images: [post.coverImage] } : undefined,
  };
}

export default async function BlogYaziPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const html = marked.parse(post.body) as string;

  return (
    <>
      <section className="page-hero on-brand">
        <div className="container">
          <Breadcrumb
            items={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
          />
          <h1>{post.title}</h1>
          {post.publishedAt ? (
            <p className="page-lead">
              {new Date(post.publishedAt).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          ) : null}
        </div>
      </section>

      <section className="section">
        <div className="container blog-post">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage} alt="" className="blog-post-cover" />
          ) : null}
          <div
            className="prose"
            // İçerik yalnızca yetkili panel kullanıcılarınca yazılır
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>

      <CTA />
    </>
  );
}
