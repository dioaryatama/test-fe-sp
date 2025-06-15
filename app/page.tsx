"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/public/logo.svg";
import Link from "next/link";
import { FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, LoginFormValue } from "./schemas/auth";

import { useRouter } from "next/navigation";

interface LoginResponse {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

interface UserDetailResponse {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValue>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormValue) => {
    setApiError(null);
    setLoading(true);
    console.log("Mencoba login dengan data:", data);

    try {
      const loginResponse = await axios.post<LoginResponse>(
        "https://dummyjson.com/auth/login",
        {
          username: data.username,
          password: data.password,
        }
      );

      const loggedInUser = loginResponse.data;
      console.log("Login berhasil! Data pengguna:", loggedInUser);

      if (loggedInUser.accessToken) {
        localStorage.setItem("userAccessToken", loggedInUser.accessToken);
        localStorage.setItem("userRefreshToken", loggedInUser.refreshToken);
        localStorage.setItem("userUsername", loggedInUser.username);

        const userDetailResponse = await axios.get<UserDetailResponse>(
          `https://dummyjson.com/users/${loggedInUser.id}`
        );
        const userRole = userDetailResponse.data.role;

        localStorage.setItem("userRole", userRole);

        alert(
          `Login berhasil! Selamat datang, ${loggedInUser.username} (${userRole}).`
        );

        if (userRole === "admin") {
          router.push("/admin");
        } else {
          router.push("/user");
        }
      } else {
        setApiError(
          "Login berhasil, tetapi access token tidak ditemukan di respons."
        );
      }

      reset();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setApiError(
          err.response?.data?.message || "Login gagal. Silakan coba lagi."
        );
        console.error("Login error:", err.response?.data);
      } else {
        setApiError("Terjadi kesalahan saat login.");
        console.error("Unexpected login error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("userAccessToken");
    const role = localStorage.getItem("userRole");

    if (accessToken && role) {
      if (role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/user");
      }
    }
    setLoading(false);
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-slate-100">
      <div className="w-full md:w-1/5 h-full md:h-auto bg-white shadow-2xl py-8 px-4 rounded-2xl flex flex-col gap-4 items-center justify-center">
        <Image
          className="relative object-cover"
          width={134}
          height={24}
          alt=""
          src={logo}
        ></Image>
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="w-full flex flex-col gap-4"
        >
          <div className="w-full">
            <p className="text-sm font-medium text-gray-900">Username</p>
            <Input
              id="username"
              placeholder="Input username"
              {...register("username")}
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <p className="text-sm font-medium text-gray-900">Password</p>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Input password"
                className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                {...register("password")}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-1 right-1 h-7 w-7"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                <FaRegEyeSlash className="h-4 w-4" />
              </Button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="bg-blue-600 w-full"
            disabled={isSubmitting || loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
          {apiError && (
            <p className="text-red-500 text-sm text-center">{apiError}</p>
          )}
        </form>
        <p className="text-sm font-normal">
          Don't have an account?{" "}
          <Link className="underline text-blue-600" href="/regist">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
