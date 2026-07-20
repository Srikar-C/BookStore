"use client"

import { TiAdjustBrightness } from "react-icons/ti";
import { useAppContext } from "./hooks/AppContext";
import { MdDarkMode } from "react-icons/md";
import { useEffect } from "react";

export default function Theme() {
    const { theme, setTheme } = useAppContext();

    useEffect(() => {
        const root = document.documentElement;
        if (theme)
            root.classList.add("dark");
        else
            root.classList.remove("dark");
    }, [theme]);

    function handleTheme() {
        setTheme((prev) => !prev);
    }

    const Icon = theme ? TiAdjustBrightness : MdDarkMode;

    return (
        <Icon className="text-5xl text-[color:var(--foreground)] absolute right-0 top-38 cursor-pointer 
        border-2 border-[color:var(--foreground)] pl-3 rounded-tl-2xl rounded-bl-2xl border-r-0 z-[20]" onClick={handleTheme} />
    )
}