"use client";

import BookCard from "@/app/components/BookCard";
import { useAppContext } from "@/app/hooks/AppContext";

export default function Carts() {

    const { user, cartItems, carts } = useAppContext();

    console.log("carts: ", cartItems, carts)

    function handleCheckout() {
        const bookcart = carts;

    }

    return (
        <div className="main h-full text-[color:var(--foreground)] bg-[color:var(--background)] p-4 flex flex-wrap items-center gap-8 justify-center">
            <button className="absolute top-20 right-5 px-3 py-2 rounded-lg font-semibold transition cursor-pointer border-2 border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)] hover:bg-[color:var(--background)] hover:text-[color:var(--foreground)] z-0 " onClick={handleCheckout}>
                Checkout
            </button>
            {user && cartItems?.map((item) => (
                <BookCard key={item.id} book={item} user={user} />
            ))}

        </div>
    )
}