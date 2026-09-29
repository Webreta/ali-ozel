"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";
import Breadcrumb from "@/components/Breadcrumb";

export const PREVIEW_STORAGE_KEY = "blog-preview";

type PreviewData = {
  title: string;
  body: string;
  coverImage: string;
};

function readPreview(): PreviewData | null {
  try {
    const raw = localStorage.getItem(PREVIEW_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PreviewData) : null;
  } catch {
    return null;
  }
}

export default function BlogPreview() {
  const [post, setPost] = useState<PreviewData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPost(readPreview());
    setLoaded(true);
    // Panelde tekrar "Önizle"ye basılınca bu sekme kendini günceller
    const onStorage = (e: StorageEvent) => {
      if (e.key === PREVIEW_STORAGE_KEY) setPost(readPreview());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!loaded) return null;

  if (!post) {
    return (
      <section className="section">
        <div className="container">
          <p>Önizlenecek yazı bulunamadı. Panelden “Önizle” butonunu kullanın.</p>
        </div>
      </section>
    );
  }

  const html = marked.parse(post.body || "") as string;

  return (
    <>
      <section className="page-hero on-brand">
        <div className="container">
          <Breadcrumb
            items={[{ label: "Blog", href: "/blog" }, { label: post.title || "Başlıksız yazı" }]}
          />
          <h1>{post.title || "Başlıksız yazı"}</h1>
          <p className="page-lead">Önizleme — bu görünüm henüz yayında değil.</p>
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
    </>
  );
}
