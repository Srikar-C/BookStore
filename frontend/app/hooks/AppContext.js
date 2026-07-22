"use client"

import { createContext, useContext, useEffect, useState } from "react";
import useFetch from "./useFetch";

const AppContext = createContext();

export function AppProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [theme, setTheme] = useState(false);
    const [search, setSearch] = useState("");
    const [books, setBooks] = useState([]);
    const [carts, setCarts] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    async function initialize() {
        setLoadingUser(true);
        //Get User Details
        const userResponse = await useFetch("get", process.env.NEXT_PUBLIC_API_Auth, process.env.NEXT_PUBLIC_MAPPING_Auth, "auth", "", true);
        const userResult = userResponse.data;
        if (!userResult.success) {
            setLoadingUser(false);
            return;
        }
        setUser(userResult.object);
        //Get User Cart
        const cartResponse = await useFetch("get", process.env.NEXT_PUBLIC_API_Cart, process.env.NEXT_PUBLIC_MAPPING_Cart, userResult.object.id, "", false);
        const cartResult = cartResponse.data;
        if (cartResult.success) {
            setCarts(cartResult.object);
        }
        //Get Books as Per User
        console.log(cartResult);
        const books = cartResult.object?.books || [];
        const bookResponse = await useFetch("post", process.env.NEXT_PUBLIC_API_Book, process.env.NEXT_PUBLIC_MAPPING_Book, "", { books }, false);
        const bookResult = bookResponse.data;
        if (bookResult.success) {
            setBooks(bookResult.object);
        }
        const items = bookResult.object.filter(book => book.count > 0);
        setCartItems(items);
        console.log("Responses: ", userResult, cartResult, bookResult);
        setLoadingUser(false);
    }

    useEffect(() => {
        initialize();
    }, [])

    return (
        <AppContext.Provider value={{
            user, setUser, theme, setTheme, search, setSearch, books, setBooks, loadingUser, carts,
            setCarts, cartItems, setCartItems, initialize
        }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}