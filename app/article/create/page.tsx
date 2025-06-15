"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaPaperclip,
  FaNewspaper,
  FaBoxes,
  FaSignOutAlt,
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
import { Textarea } from "@/components/ui/textarea";
import logo from "@/public/logo.svg";

export default function CreateArticlePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailFile(null);
      setThumbnailPreview(null);
      alert("Please select a valid image file (jpg or png).");
    }
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = event.target.value;
    setContent(text);
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
  };

  const handleUpload = async () => {
    setIsSubmitting(true);
    // Di sini Anda akan mengirim data ke API backend Anda
    // Contoh menggunakan FormData untuk file dan data lainnya
    // const formData = new FormData();
    // if (thumbnailFile) {
    //   formData.append('thumbnail', thumbnailFile);
    // }
    // formData.append('title', title);
    // formData.append('category', category);
    // formData.append('content', content);

    // try {
    //   const response = await axios.post('/api/articles', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'Authorization': `Bearer ${localStorage.getItem('userAccessToken')}` // Jika perlu autentikasi
    //     }
    //   });
    //   console.log("Article uploaded successfully:", response.data);
    //   alert("Article uploaded successfully!");
    //   router.push('/admin/dashboard'); // Kembali ke dashboard setelah upload
    // } catch (error) {
    //   console.error("Error uploading article:", error);
    //   alert("Failed to upload article.");
    // } finally {
    //   setIsSubmitting(false);
    // }

    // Simulasi upload
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log({ thumbnailFile, title, category, content });
        alert("Article uploaded successfully! (Simulated)");
        setIsSubmitting(false);
        router.push("/admin/dashboard"); // Kembali ke dashboard setelah simulasi
        resolve(true);
      }, 1500);
    });
  };

  const handlePreview = () => {
    // Di sini Anda bisa mengarahkan ke halaman preview lokal
    // atau menampilkan modal preview
    alert(
      "Preview feature not implemented yet. Data: " +
        JSON.stringify({
          title,
          category,
          content,
          thumbnail: thumbnailPreview ? "Image attached" : "No image",
        })
    );
  };

  const handleCancel = () => {
    router.push("/admin/dashboard"); // Kembali ke dashboard
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Bagian ini bisa di-reuse dari AdminDashboardPage */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col z-50">
        <div className="flex items-center p-4 h-16">
          <Image
            src={logo}
            alt="Logospsum"
            width={134}
            height={24}
            className="filter brightness-0 invert"
          />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a
            href="/admin/dashboard"
            className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 bg-blue-500"
          >
            <FaNewspaper className="mr-3" /> Articles
          </a>
          <a
            href="/admin/categories"
            className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <FaBoxes className="mr-3" /> Category
          </a>
          <Button
            onClick={() => router.push("/logout")} // Pastikan Anda memiliki rute logout atau fungsi di komponen parent
            className="w-full bg-transparent border-none shadow-none flex items-center justify-start gap-2 font-normal text-base hover:bg-gray-700"
          >
            <FaSignOutAlt /> Logout
          </Button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Konten */}
        <header className="flex items-center p-4 bg-white shadow-md h-16">
          <button onClick={() => router.back()} className="text-gray-600 mr-4">
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Create Articles
          </h1>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Thumbnails Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Thumbnails
              </h2>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png"
                className="hidden"
              />
              <div
                className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {thumbnailPreview ? (
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    width={192} // 48 * 4
                    height={192} // 48 * 4
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <>
                    <FaPaperclip size={32} className="text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">
                      Click to select files
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Support File Type : jpg or png
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Title Input */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Title
              </h2>
              <Input
                type="text"
                placeholder="Input title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* Category Select */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Category
              </h2>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg p-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  {/* Tambahkan kategori lain sesuai kebutuhan */}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-2">
                The existing category list can be seen in the{" "}
                <Link
                  href="/admin/categories"
                  className="text-blue-600 underline"
                >
                  category
                </Link>{" "}
                menu
              </p>
            </div>

            {/* Content Editor */}
            <div className="mb-6">
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                {/* Toolbar Editor Placeholder */}
                <div className="flex space-x-4 p-3 border-b border-gray-300 bg-gray-50">
                  <button className="text-gray-600 hover:text-gray-900">
                    <FaBold />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <FaItalic />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <FaUnderline />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <FaListUl />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <FaListOl />
                  </button>
                </div>
                <Textarea
                  placeholder="Type a content..."
                  value={content}
                  onChange={handleContentChange}
                  className="w-full h-64 p-4 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0" // Hilangkan border/ring dari textarea
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{wordCount} Words</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={isSubmitting}
              >
                Preview
              </Button>
              <Button onClick={handleUpload} disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
