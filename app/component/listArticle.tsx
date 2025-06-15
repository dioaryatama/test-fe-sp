import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface Article {
  article_id: string;
  title: string;
  link: string;
  creator: string | null;
  pubDate: string;
  image_url: string | null;
  description: string | null;
  category?: string[];
}

const ListArticle = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [nextpage, setNextpage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await axios.get<any>(
        nextpage === null
          ? "https://newsdata.io/api/1/latest?apikey=pub_af7049a35bf8419abf3feaca8ca639aa&q=tech"
          : `https://newsdata.io/api/1/latest?apikey=pub_af7049a35bf8419abf3feaca8ca639aa&q=tech&page=${nextpage}`
      );

      setArticles(response.data.results);
      setNextpage(response.data.nextPage);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setApiError(err.message);
        console.error("Error fetching articles:", err.message);
      } else {
        setApiError("Terjadi kesalahan yang tidak diketahui.");
        console.error("Unexpected error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading && articles.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-xl text-slate-700">Memuat artikel...</p>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <p className="text-xl text-red-600">Error: {apiError}</p>
        <p className="text-md text-red-500 mt-2 text-center">
          Pastikan API Key Anda valid dan tidak mencapai batas request harian.
        </p>
      </div>
    );
  }

  return (
    <div className="h-auto w-full py-8 px-16 flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {articles.length > 0 ? (
          articles.map((article) => {
            return (
              <div
                key={article.article_id}
                className="h-96 w-full flex flex-col justify-start items-start gap-2 border rounded-xl shadow-sm p-4"
              >
                <div className="w-full h-48 rounded-2xl overflow-hidden bg-gray-200">
                  {article.image_url ? (
                    <img
                      className="w-full h-full object-cover min-w-full max-w-full"
                      src={article.image_url}
                      alt={article.title || "Article Image"}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex justify-center items-center w-full h-full text-gray-500">
                      Tidak ada gambar
                    </div>
                  )}
                </div>
                <p className="text-sm font-normal text-slate-600">
                  {article.pubDate
                    ? new Date(article.pubDate).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Tanggal tidak diketahui"}
                </p>
                <h2 className="text-lg font-semibold text-slate-900 line-clamp-2">
                  {article.title || "Judul tidak tersedia"}
                </h2>
                <p className="text-base font-normal text-slate-600 line-clamp-2">
                  {article.description || "Deskripsi tidak tersedia."}
                </p>
                <div className="flex gap-x-4 mt-auto">
                  {article.category && article.category.length > 0 ? (
                    article.category.map((cat) => (
                      <div
                        key={cat}
                        className="bg-blue-200 py-1 px-3 flex justify-center items-center rounded-full"
                      >
                        <p className="text-xs text-blue-900 font-normal">
                          {cat}
                        </p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="bg-blue-200 py-1 px-3 flex justify-center items-center rounded-full">
                        <p className="text-xs text-blue-900 font-normal">
                          Technology
                        </p>
                      </div>
                      <div className="bg-blue-200 py-1 px-3 flex justify-center items-center rounded-full">
                        <p className="text-xs text-blue-900 font-normal">
                          Design
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex justify-center items-center h-96">
            <p className="text-xl text-slate-700">
              {loading
                ? "Memuat artikel..."
                : "Tidak ada artikel yang ditemukan."}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Button onClick={fetchArticles} disabled={loading || !nextpage}>
          {loading ? "Memuat..." : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default ListArticle;
