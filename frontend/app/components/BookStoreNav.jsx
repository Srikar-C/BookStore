"use client";

import Link from "next/link";
import Logo from "../assets/Logo";
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useAppContext } from "../hooks/AppContext";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { FcSettings } from "react-icons/fc";
import { IoMdLogOut } from "react-icons/io";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookStoreNav() {

    const router = useRouter();
    const { user, search, setSearch, cartItems } = useAppContext();

    const cartCount = cartItems.length;

    const [drop, setDrop] = useState(false);

    function handleBook() {

    }

    function handleCart() {
        router.push("/bookstore/carts");
        setDrop(false);
    }

    function handleSettings() {
        router.push("/bookstore/settings");
        setDrop(false);
    }
    function handleLogout() {
        router.replace("/");
        setDrop(false);
    }

    return (
        <div className="book-navigation fixed w-full bg-[color:var(--background)] z-1">
            <nav className="nav shadow-xs shadow-[color:var(--foreground)] flex justify-between items-center p-2">
                <Link href="/bookstore" className="left">
                    <Logo />
                </Link>
                <nav className="right flex flex-row items-center gap-4">
                    {user?.role == "ADMIN" && <span className="addbook text-[color:var(--background)] hover:text-[color:var(--textground)] p-2 rounded-xl bg-[color:var(--foreground)] hover:bg-[color:var(--background)] hover:shadow-xs hover:shadow-[color:var(--foreground)] cursor-pointer" onClick={handleBook}>Add Book</span>}
                    <div className="search text-black bg-white p-1 rounded-xl flex gap-2 items-center border-2 border-[color:var(--foreground)]">
                        <FaSearch className="text-xl" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                            className="search bg-transparent outline-none border-none items-center" placeholder="Search By Title" />
                        <RxCross2 className={`text-xl cursor-pointer ${search.length > 0 ? "opacity-100" : "opacity-0"}`} onClick={() => setSearch("")} />
                    </div>
                    {user?.role == "USER" &&
                        <div className={`cart relative hover:bg-white hover:text-black p-1 rounded-2xl cursor-pointer}`} onClick={handleCart}>
                            <PiShoppingCartSimpleBold className={`text-3xl cursor-pointer`} />
                            {cartCount > 0 &&
                                <span className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 cursor-pointer`}>{cartCount}</span>
                            }
                        </div>
                    }
                    <nav className="userdrop w-10 flex justify-around" onClick={() => setDrop(!drop)}>
                        <FaRegUserCircle className="text-4xl cursor-pointer" />
                    </nav>
                </nav>
                <nav className={`dropdown absolute right-3 top-[10vh] shadow-inner shadow-[#c3c3c3] p-1 *:p-2 flex flex-col gap-2 items-start *:cursor-pointer transform transition-all duration-300 ease-out ${drop ? 'translate-y-0 opacity-100 pointer-events-auto z-1' : '-z-1 -translate-y-16 opacity-0 pointer-events-none'} z-1 bg-[color:var(--background)] text-[color:var(--foreground)] `}>
                    <div className="settings flex gap-3 items-center " onClick={handleSettings}>
                        <FcSettings className="text-xl" />
                        <p>Settings</p>
                    </div>
                    <div className="logout flex gap-3 items-center" onClick={handleLogout}>
                        <IoMdLogOut className="text-xl" />
                        <p>Logout</p>
                    </div>
                </nav>
            </nav>
        </div>
    )
}