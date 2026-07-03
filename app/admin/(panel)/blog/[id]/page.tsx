import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import BlogForm from "../BlogForm";
import { updatePost } from "../actions";

export const metadata: Metadata = { title: "Yazıyı Düzenle" };

export default async function YaziDuzenlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, numericId))
    .limit(1);
  if (!post) notFound();

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>{post.title}</h1>
          <p>
            /blog/{post.slug}
            {post.status === "published" ? (
              <>
                {" · "}
                <Link href={`/blog/${post.slug}`} target="_blank" className="adm-row-link" style={{ display: "inline" }}>
                  Sitede görüntüle ↗
                </Link>
              </>
            ) : null}
          </p>
        </div>
      </div>
      <div className="adm-card">
        <BlogForm action={updatePost.bind(null, post.id)} initialData={post} />
      </div>
    </>
  );
}
