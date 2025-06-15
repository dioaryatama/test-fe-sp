import logo from "@/public/logo.svg";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";

const Hero = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userUsername");

    if (storedUserName) {
      setUserName(storedUserName);
    }
    setIsLoadingUser(false);
  }, []);

  return (
    <div className="relative w-full h-[50vh] flex flex-col justify-start items-beetwen">
      <div className="absolute inset-0 bg-cover bg-center bg-[url(@/public/bg-image.jpg)]"></div>

      <div className="absolute inset-0 bg-[#2563EBDB]"></div>

      <nav className="relative z-10 flex justify-between p-8 items-center">
        <Image
          className="relative object-cover filter brightness-0 invert"
          width={134}
          height={24}
          alt="Blog GenZet Logo"
          src={logo}
        ></Image>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              className="w-8 h-8 rounded-full"
              src="https://github.com/shadcn.png"
              alt="User Avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {isLoadingUser ? (
            <p className="text-white text-sm">Memuat...</p>
          ) : (
            <p className="text-white text-base font-medium">
              {userName || "Pengguna"}
            </p>
          )}
        </div>
      </nav>
      <div className="relative z-10 flex flex-col justify-center items-center gap-4">
        <p className="text-base font-bold text-white">Blog genzet</p>
        <p className="text-5xl font-medium text-white w-2/4 text-center">
          The Journal : Design Resources, Interviews, and Industry News
        </p>
        <p className="text-2xl font-normal text-white text-center">
          Your daily dose of design insights!
        </p>
      </div>
      <div className="relative z-10 flex justify-center items-center pt-8">
        <div className="flex justify-center items-center gap-4 bg-blue-500 w-1/4 p-2 rounded-2xl">
          <Select>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-grow">
            <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
              <FaSearch className="h-4 w-4" />
            </div>
            <Input
              id="search"
              type="search"
              placeholder="Search article"
              className="w-full rounded-lg bg-background pl-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
