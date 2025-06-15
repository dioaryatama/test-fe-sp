"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaBars,
  FaTimes,
  FaNewspaper,
  FaBoxes,
  FaSignOutAlt,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import logo from "@/public/logo.svg";
import axios, { AxiosResponse } from "axios";

interface Article {
  uuid: string;
  title: string;
  image_url: string | null;
  categories: string[];
  published_at: string;
  url: string;
}

interface TheNewsApiData {
  data: Article[];
  meta: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  console.log("🚀 ~ AdminDashboardPage ~ userRole:", userRole);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [articlesApiError, setArticlesApiError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const ARTICLES_PER_PAGE = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

  const fetchArticles = useCallback(
    async (page: number, query: string = searchQuery) => {
      setLoadingArticles(true);
      setArticlesApiError(null);
      try {
        const API_KEY = "fUOrZvd2NrGxt9WoIzqt3lNdNttFuinyCbXuHXl9";
        let url = `https://api.thenewsapi.com/v1/news/top?api_token=${API_KEY}&locale=us&limit=${ARTICLES_PER_PAGE}&page=${page}`;
        if (query) {
          url += `&search=${encodeURIComponent(query)}`;
        }
        const response: AxiosResponse<TheNewsApiData> = await axios.get(url);
        setArticles(response.data.data);
        setTotalArticles(response.data.meta.found);
        setCurrentPage(page);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setArticlesApiError(err.message);
          console.error(
            "Error fetching articles:",
            err.response?.data || err.message
          );
        } else {
          setArticlesApiError(
            "Terjadi kesalahan yang tidak diketahui saat mengambil artikel."
          );
          console.error("Unexpected error fetching articles:", err);
        }
      } finally {
        setLoadingArticles(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    const accessToken = localStorage.getItem("userAccessToken");
    const storedUsername = localStorage.getItem("userUsername");
    const storedRole = localStorage.getItem("userRole");

    if (!accessToken || !storedRole) {
      alert("Anda harus login sebagai admin untuk mengakses halaman ini.");
      router.push("/");
    } else if (storedRole !== "admin") {
      alert("Akses ditolak. Anda bukan admin.");
      localStorage.removeItem("userAccessToken");
      localStorage.removeItem("userUsername");
      localStorage.removeItem("userRole");
      router.push("/");
    } else {
      setUsername(storedUsername);
      setUserRole(storedRole);
      setIsCheckingSession(false);
      fetchArticles(1);
    }

    return () => {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
    };
  }, [router, fetchArticles, searchTimer, searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("userAccessToken");
    localStorage.removeItem("userUsername");
    localStorage.removeItem("userRole");
    alert("Anda telah logout.");
    router.push("/");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    const newTimer = setTimeout(() => {
      fetchArticles(1, query);
    }, 500);

    setSearchTimer(newTimer);
  };

  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

  const renderPaginationItems = () => {
    const maxPagesToShow = 5;
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(
        <PaginationItem key="first">
          <PaginationLink
            href="#"
            onClick={() => fetchArticles(1, searchQuery)}
            isActive={currentPage === 1}
          >
            <Button
              variant={currentPage === 1 ? "default" : "ghost"}
              disabled={loadingArticles}
            >
              1
            </Button>
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={() => fetchArticles(i, searchQuery)}
            isActive={i === currentPage}
          >
            <Button
              variant={i === currentPage ? "default" : "ghost"}
              disabled={loadingArticles}
            >
              {i}
            </Button>
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      if (!pages.some((item) => item.key === totalPages.toString())) {
        pages.push(
          <PaginationItem key="last">
            <PaginationLink
              href="#"
              onClick={() => fetchArticles(totalPages, searchQuery)}
              isActive={currentPage === totalPages}
            >
              <Button
                variant={currentPage === totalPages ? "default" : "ghost"}
                disabled={loadingArticles}
              >
                {totalPages}
              </Button>
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  if (isCheckingSession) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Memverifikasi akses admin...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out
                   w-64 bg-blue-600 text-white flex flex-col z-50`}
      >
        <div className="flex items-center p-4 h-16">
          <Image
            src={logo}
            alt="Logospsum"
            width={134}
            height={24}
            className="filter brightness-0 invert"
          />
          <button
            className="md:hidden text-white ml-auto"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a
            href="/admin/dashboard"
            className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 bg-blue-500"
          >
            <FaNewspaper className="mr-3" />
            Articles
          </a>
          <a
            href="/admin/categories"
            className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <FaBoxes className="mr-3" />
            Category
          </a>
          <Button
            onClick={handleLogout}
            className="w-full bg-transparent border-none shadow-none flex items-center justify-start gap-2 font-normal text-base hover:bg-gray-700"
          >
            <FaSignOutAlt />
            Logout
          </Button>
        </nav>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-white shadow-md h-16">
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaBars size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 ml-4 md:ml-0">
            Articles
          </h1>
          <div className="flex items-center space-x-3 ml-auto">
            <span className="text-gray-700 font-medium">
              {username || "Admin User"}
            </span>
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-lg">
              {username ? username.charAt(0).toUpperCase() : "J"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4 border-b p-4">
              <h2 className="text-md font-medium text-gray-700">
                Total Articles : {loadingArticles ? "Memuat..." : totalArticles}
              </h2>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <FaPlus size={14} />
                Add Articles
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 p-4">
              <Select>
                <SelectTrigger className="w-[180px] bg-white border border-gray-300">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-grow">
                <Input
                  type="search"
                  placeholder="Search by title"
                  className="w-full rounded-lg bg-background pl-8 border border-gray-300"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <div className="absolute left-2.5 top-2.5 text-muted-foreground">
                  <FaSearch className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loadingArticles ? (
                <div className="flex justify-center items-center h-48">
                  <p className="text-lg text-gray-600">Memuat artikel...</p>
                </div>
              ) : articlesApiError ? (
                <div className="flex justify-center items-center h-48">
                  <p className="text-lg text-red-600">
                    Error: {articlesApiError}
                  </p>
                </div>
              ) : articles.length === 0 ? (
                <div className="flex justify-center items-center h-48">
                  <p className="text-lg text-gray-600">
                    Tidak ada artikel yang ditemukan.
                  </p>
                </div>
              ) : (
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <th className="py-3 px-4 w-20">Thumbnails</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4 w-32">Category</th>
                      <th className="py-3 px-4 w-40">Created at</th>
                      <th className="py-3 px-4 w-40 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => (
                      <tr
                        key={article.uuid}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <td className="py-3 px-4">
                          {article.image_url ? (
                            <Image
                              src={article.image_url}
                              alt="Thumbnail"
                              width={60}
                              height={60}
                              className="rounded object-cover"
                            />
                          ) : (
                            <div className="w-[60px] h-[60px] bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                              No Img
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-800 text-sm font-medium">
                          {article.title}
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {article.categories && article.categories.length > 0
                            ? article.categories[0]
                            : "N/A"}
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {new Date(article.published_at).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }
                          )}
                        </td>
                        <td className="py-3 px-4 flex items-center justify-center space-x-2">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                          >
                            Preview
                          </a>
                          <a
                            href="#"
                            className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                          >
                            Edit
                          </a>
                          <button className="text-red-600 hover:underline flex items-center gap-1 text-sm">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex justify-between items-center p-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={() =>
                        fetchArticles(currentPage - 1, searchQuery)
                      }
                    >
                      <Button
                        variant="ghost"
                        disabled={currentPage === 1 || loadingArticles}
                      >
                        Previous
                      </Button>
                    </PaginationLink>
                  </PaginationItem>

                  {renderPaginationItems().map((item) => item)}

                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={() =>
                        fetchArticles(currentPage + 1, searchQuery)
                      }
                    >
                      <Button
                        variant="ghost"
                        disabled={currentPage === totalPages || loadingArticles}
                      >
                        Next
                      </Button>
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
