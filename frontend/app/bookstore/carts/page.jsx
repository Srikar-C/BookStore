"use client";

import BookCard from "@/app/components/BookCard";
import { useAppContext } from "@/app/hooks/AppContext";
import useFetch from "@/app/hooks/useFetch";
import { showSuccess } from "@/app/utils/showToasts";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Carts() {

    const router = useRouter();
    const { user, cartItems, carts, initialize, setCarts } = useAppContext();

    console.log("carts: ", cartItems, carts)

    useEffect(() => {
        getCart();
    }, [cartItems])

    async function getCart() {
        const cartResponse = await useFetch("get", process.env.NEXT_PUBLIC_API_Cart, process.env.NEXT_PUBLIC_MAPPING_Cart, user.id, "", false);
        const cartResult = cartResponse.data;
        if (cartResult.success) {
            setCarts(cartResult.object);
        }
    }

    async function handleCheckout() {
        const orders = {
            cartId: carts._id,
            userId: carts.userId,
            books: carts.books.filter(item => item.count > 0)
                .map((item) => {
                    const book = cartItems.find(b => b.id == item.bookId);
                    return {
                        bookId: item.bookId,
                        quantity: book.quantity,
                        price: book.price,
                        count: item.count
                    }
                })
        }
        const response = await useFetch("post", process.env.NEXT_PUBLIC_API_Order, process.env.NEXT_PUBLIC_MAPPING_Order, "checkout", { orders }, false);
        console.log("book details: ", response.data);
        const orderResponse = response.data;
        if (orderResponse.success) {
            showSuccess(orderResponse.message);
            router.push("/bookstore");
        }
        initialize();
    }

    if (!carts) {
        return (
            <div className="text-gray-400">No Items in Cart</div>
        )
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