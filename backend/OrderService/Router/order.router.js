import express from "express";
import orderModel from "../Schema/order.schema.js";
import { generatedId } from "../util/orderUtils.js";
import axios from "axios";

const router = express.Router();


router.post("/orders/checkout", async (req, res) => {
    const { orders } = req.body;
    console.log("Request: ", orders);
    try {
        const books = orders.books.filter(item => item.count > 0)
            .map(item => ({
                bookId: item.bookId,
                count: item.count,
            }));
        const totalPrice = orders.books.reduce((total, item) => {
            return total + (item.price * item.count)
        }, 0);
        const order = new orderModel({
            _id: await generatedId(),
            userId: orders.userId,
            books: books,
            price: totalPrice
        })
        // create order
        console.log("New order: ", order);
        const createdOrder = await order.save();
        // update books
        console.log(`cart url: ${process.env.NEXT_PUBLIC_API_Book}/${process.env.NEXT_PUBLIC_MAPPING_Book}`)
        const bookUpdate = await axios.put(`${process.env.NEXT_PUBLIC_API_Book}/${process.env.NEXT_PUBLIC_MAPPING_Book}`, { books: order.books });
        const bookResponse = bookUpdate.data;
        console.log("Book Response: ", bookResponse);

        if (bookResponse.success) {
            // delete cart
            console.log(`cart url: ${process.env.NEXT_PUBLIC_API_Cart}/${process.env.NEXT_PUBLIC_MAPPING_Cart}/${orders.cartId}`);
            const deleteCart = await axios.delete(`${process.env.NEXT_PUBLIC_API_Cart}/${process.env.NEXT_PUBLIC_MAPPING_Cart}/${orders.cartId}`);
            return res.status(200).json({ success: true, message: "Order Placed", object: null, kind: "success" });
        }
        return res.status(500).json(bookResponse);
    } catch (error) {
        console.error("Error in creating order: ", error);
        return res.status(500).json({ success: false, message: error, object: null, kind: "success" });
    }

})

export default router;