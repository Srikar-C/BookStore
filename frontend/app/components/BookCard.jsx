import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import useFetch from "../hooks/useFetch";
import toast from "react-hot-toast";
import { useAppContext } from "../hooks/AppContext";

export default function BookCard({ book, user }) {

    const router = useRouter();
    const { setCartItems } = useAppContext();
    const [count, setCount] = useState(book.count);

    async function updatingCall(newCount) {
        const previouscount = count;
        try {
            console.log(user.id, book.id, newCount);
            const cart = {
                userid: user.id,
                bookid: book.id,
                count: newCount,
                quantity: book.quantity
            };
            const response = await useFetch("put", process.env.NEXT_PUBLIC_API_Cart, process.env.NEXT_PUBLIC_MAPPING_Cart, "updateCart", cart, false);
            console.log("book details: ", response);
            setCount(newCount);
            setCartItems(prev => {
                // Remove
                if (newCount === 0) {
                    return prev.filter(item => item.id !== book.id);
                }

                // Check if book exists
                const exists = prev.some(item => item.id === book.id);

                // Update
                if (exists) {
                    return prev.map(item =>
                        item.id === book.id
                            ? { ...item, count: newCount }
                            : item
                    );
                }

                // Add
                return [...prev, { ...book, count: newCount }];
            });
        } catch (err) {
            setCount(previouscount);
            console.log("error for not updating cart-> " + err)
            toast.error("Couldn't update cart");
        }
    }

    async function handleBook() {
        if (user.role == "ADMIN") {
            router.push(`/bookstore/${book.id}`);
        }
        else {
            if (count == 0) {
                await updatingCall(1);
            }
        }
    }

    async function decrementCount() {
        if (count > 0) {
            const newCount = count - 1;
            await updatingCall(newCount);
        }
    }

    function incrementCount() {
        if (count < book.quantity) {
            const newCount = count + 1;
            updatingCall(newCount);
        }
        else {
            toast.error("No more stocks");
        }
    }

    return (
        <div key={book.id} className="group relative h-[350px] w-[280px] overflow-hidden rounded-2xl bg-neutral-900 shadow-xl transition-all duration-300 hover:shadow-2xl border-2 border-[color:var(--foreground)]">

            {/* Book Image */}
            <img
                src={book.url}
                alt={book.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Title */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/70 to-transparent p-5 transition-opacity duration-300 group-hover:opacity-0">
                <h2 className="text-xl font-bold text-white">
                    {book.title}
                </h2>
            </div>

            {/* Hover Details */}
            <div className="absolute inset-0 flex translate-y-full flex-col justify-end bg-black/80 p-5 text-white backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0">

                <h2 className="mb-1 text-2xl font-bold">
                    {book.title}
                </h2>

                <p className="mb-3 text-sm text-neutral-300">
                    by <b>{book.author}</b>
                </p>

                <div className="mb-3 flex flex-wrap gap-2">

                    <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold">
                        ₹ {book.price}
                    </span>

                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold">
                        Stock : {book.quantity}
                    </span>

                    <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold">
                        You Own : {count}
                    </span>

                </div>

                <p className="line-clamp-5 text-sm leading-6 text-neutral-200">
                    {book.description}
                </p>

                <button onClick={handleBook} className="mt-5 rounded-lg bg-white py-2 font-semibold text-black transition hover:bg-neutral-200 cursor-pointer">
                    {user.role == "USER" ?
                        count == 0 ? "Add to Cart" :
                            <div className="flex items-center justify-around px-3">
                                <span onClick={decrementCount}>{count == 1 ? <MdOutlineDeleteForever className='text-xl mx-auto' /> : <FaMinus className='text-xl mx-auto' />}</span>
                                <span>{count}</span>
                                <span onClick={incrementCount}><FaPlus /></span>

                            </div>
                        : "Edit Cart"}
                </button>

            </div>

        </div>
    )
}