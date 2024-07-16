"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/patients");
  }, []);

  return <div className="flex h-screen max-h-screen w-screen"></div>;
}
