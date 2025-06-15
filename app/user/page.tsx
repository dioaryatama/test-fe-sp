"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "../component/hero";
import ListArticle from "../component/listArticle";
import Footer from "../component/footer";

export default function UserDashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("userAccessToken");
    const storedUsername = localStorage.getItem("userUsername");
    const userRole = localStorage.getItem("userRole");

    if (!accessToken) {
      alert("Anda harus login untuk mengakses halaman ini.");
      router.push("/");
    } else if (!userRole) {
      alert("Informasi role tidak ditemukan. Silakan login kembali.");
      localStorage.removeItem("userAccessToken");
      localStorage.removeItem("userUsername");
      localStorage.removeItem("userRole");
      router.push("/");
    } else if (userRole === "admin") {
      alert(
        "Anda memiliki akses admin. Mengarahkan ke halaman admin dashboard."
      );
      router.push("/admin/dashboard");
    } else if (userRole === "user") {
      setUsername(storedUsername);
      setIsCheckingSession(false);
    } else {
      alert("Role tidak valid. Silakan login kembali.");
      localStorage.removeItem("userAccessToken");
      localStorage.removeItem("userUsername");
      localStorage.removeItem("userRole");
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userAccessToken");
    localStorage.removeItem("userUsername");
    localStorage.removeItem("userRole");
    alert("Anda telah logout.");
    router.push("/");
  };

  if (isCheckingSession) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Memeriksa sesi...</p>
      </div>
    );
  }

  return (
    <>
      <Hero />
      <ListArticle />
      <Footer />
      <button
        onClick={handleLogout}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        Logout
      </button>
    </>
  );
}
