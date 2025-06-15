import Image from "next/image";
import logo from "@/public/logo.svg";

const Footer = () => {
  return (
    <>
      <div className="w-full h-auto py-4 flex justify-center items-center bg-blue-600 gap-4">
        <Image
          className="relative object-cover filter brightness-0 invert"
          width={134}
          height={24}
          alt=""
          src={logo}
        ></Image>
        <p className="text-base font-normal text-white">
          © 2025 Blog genzet. All rights reserved.
        </p>
      </div>
    </>
  );
};

export default Footer;
