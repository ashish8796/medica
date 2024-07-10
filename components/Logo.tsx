import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface LogoProps {
  w: string;
  h: string;
  className?: string;
}

const Logo = ({ className = "", w, h }: LogoProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/assets/icons/logo-icon.svg"
        alt="Logo"
        height={1000}
        width={1000}
        className={cn(w, h)}
      />
      <h1 className="text-xl font-bold ml-[10px]">Medica</h1>
    </div>
  );
};

export default Logo;
