"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/logo.svg";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

interface ArticleDetail {
  uuid: string;
  title: string;
  image_url: string;
  categories: string[];
  published_at: string;
  description: string;
  snippet: string;
  url: string;
  source: string;
}

interface RelatedArticle {
  uuid: string;
  title: string;
  image_url: string | null;
  published_at: string;
  categories: string[];
  url: string;
}

export default function ArticlePreviewPage() {
  const params = useParams();
  const articleUuid = params.uuid as string;

  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticleDetail = async (uuid: string) => {
    setLoading(true);
    setError(null);
    try {
      const API_KEY = "fUOrZvd2NrGxt9WoIzqt3lNdNttFuinyCbXuHXl9";

      const detailResponse = await axios.get(
        `https://api.thenewsapi.com/v1/news/uuid/${uuid}?api_token=${API_KEY}`
      );

      const foundArticle = detailResponse.data;

      if (foundArticle && foundArticle.uuid === uuid) {
        setArticle(foundArticle);

        const relatedResponse = await axios.get(
          `https://api.thenewsapi.com/v1/news/top?api_token=${API_KEY}&locale=us&limit=4`
        );
        const filteredRelated = relatedResponse.data.data.filter(
          (art: ArticleDetail) => art.uuid !== uuid
        );
        setRelatedArticles(
          filteredRelated.slice(0, 3).map((art: ArticleDetail) => ({
            uuid: art.uuid,
            title: art.title,
            image_url: art.image_url,
            published_at: art.published_at,
            categories: art.categories,
            url: art.url,
          }))
        );
      } else {
        setError("Artikel tidak ditemukan dengan UUID ini.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Error saat mengambil detail artikel. API Key mungkin tidak valid atau UUID salah."
        );
        console.error(
          "Error fetching article detail:",
          err.response?.data || err.message
        );
      } else {
        setError(
          "Terjadi kesalahan yang tidak diketahui saat mengambil detail artikel."
        );
        console.error("Unexpected error fetching article detail:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (articleUuid) {
      fetchArticleDetail(articleUuid);
    }
  }, [articleUuid]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Memuat artikel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-red-600">Error: {error}</p>
        <p className="text-md text-red-500 mt-2">
          Pastikan UUID artikel benar atau API Key valid.
        </p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-white">
        <p className="text-xl text-gray-700">Artikel tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-white flex flex-col justify-center items-center">
      <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center z-10">
        <Image src={logo} alt="Logospsum" width={120} height={20} />
        <div className="flex items-center space-x-3">
          <span className="text-gray-700 font-medium">James Dean</span>
          <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-lg">
            J
          </div>
        </div>
      </header>

      <main className="w-5/6  bg-white p-8 md:p-12 mt-8 mb-8 flex flex-col justify-center items-center">
        <p className="text-sm text-gray-500 mb-2">
          {new Date(article.published_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}{" "}
          • Created by Admin
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6 text-center">
          {article.title}
        </h1>

        {article.image_url && (
          <div className="w-full h-auto relative mb-8 rounded-lg overflow-hidden flex justify-center">
            <img
              src={article.image_url}
              alt={article.title}
              className="object-cover w-full"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none w-full text-gray-700 leading-relaxed ">
          <p className="mb-4">{article.snippet}</p>
          <p>{article.description}</p>
          <p className="mt-4 text-sm text-gray-600">
            Source: {article.source} | Read full article:{" "}
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {article.url}
            </a>
          </p>
        </div>
      </main>

      <section className="w-full max-w-4xl bg-white p-8 md:p-12 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Other articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedArticles.map((related) => (
            <Link
              key={related.uuid}
              href={`/article/${related.uuid}`}
              className="block group"
            >
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                {related.image_url ? (
                  <div className="w-full h-40 relative">
                    <img
                      src={related.image_url}
                      alt={related.title}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 250px"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(related.published_at).toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric", year: "numeric" }
                    )}
                  </p>
                  <h3 className="text-md font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {related.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {related.categories.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="w-full bg-gray-800 text-white py-8 text-center mt-auto">
        <p>© 2025 Blog genzet. All rights reserved.</p>
      </footer>
    </div>
  );
}
