"use client"

import Link from "next/link";
import "./globals.css";
import { useEffect } from "react";
import { useAppContext } from "./hooks/AppContext";

export default function Home() {

  const { theme } = useAppContext();

  useEffect(() => {
    const root = document.documentElement;
    if (theme)
      root.classList.add("dark");
    else
      root.classList.remove("dark");
  }, [theme]);

  return (
    <>
      {/* <Snowfall color={theme ? "#fff" : "#000"} speed={[0.5, 1]} snowflakeCount={100} /> */}
      <nav className="navigation backdrop-blur-2xl bg-white/10 w-125 absolute top-5 left-1/2 -translate-x-1/2 mx-auto flex items-center justify-between px-4 py-2 rounded-3xl shadow-sm shadow-[color:var(--foreground)]">
        <Link href="/" className="left font-semibold uppercase text-xl text-[color:var(--foreground)] tracking-wider w-fit">
          BookStore
        </Link>
        <nav className="right flex items-center justify-between w-1/3">
          <Link href="/login" className="text-[color:var(--foreground)] hover:text-[color:var(--background)] hover:bg-[color:var(--foreground)] p-1 rounded-sm">
            Login
          </Link>
          <Link href="/login" className="text-[color:var(--foreground)] hover:text-[color:var(--background)] hover:bg-[color:var(--foreground)] p-1 rounded-sm">
            Register
          </Link>
        </nav>
      </nav>
    </>
  );
}
