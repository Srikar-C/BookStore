"use client";

import { useEffect } from "react";
import BookStoreNav from "../components/BookStoreNav";
import useFetch from "../hooks/useFetch";
import { useAppContext } from "../hooks/AppContext";

export default function BookStore({ children }) {

    const { setUser, setBooks } = useAppContext();

    async function getUser() {
        const response = await useFetch("get", process.env.NEXT_PUBLIC_API_Auth, process.env.NEXT_PUBLIC_MAPPING_Auth, "auth", "", true);
        const result = response.data;
        if (result.success) {
            setUser(result.object);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className="main h-screen flex flex-col z-1">
            <BookStoreNav />
            <div className="mt-[14vh] -z-1">{children}</div>
        </div>
    )
}