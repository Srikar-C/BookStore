"use client";

import { useRouter } from "next/navigation";
import BookCard from "../components/BookCard";
import { useAppContext } from "../hooks/AppContext"
import { useEffect } from "react";

export default function BookStoreMain() {

    const router = useRouter();
    const { user, loadingUser, books } = useAppContext();

    console.log(user, books);

    useEffect(() => {
        if (!loadingUser && user == null) {
            router.replace("/login");
        }
    }, [loadingUser, user])

    if (loadingUser) {
        return <p>Loading...</p>
    }

    return (
        <div className="main h-full text-[color:var(--foreground)] bg-[color:var(--background)] p-4 flex flex-wrap items-center gap-8 justify-center">
            {user && books?.map((item) => (
                <BookCard key={item.id} book={item} user={user} />
            ))}
        </div>
    )
}