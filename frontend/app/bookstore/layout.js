"use client";

import BookStoreNav from "../components/BookStoreNav";

export default function BookStore({ children }) {

    return (
        <div className="main h-screen flex flex-col z-1">
            <BookStoreNav />
            <div className="mt-[14vh] -z-1">{children}</div>
        </div>
    )
}