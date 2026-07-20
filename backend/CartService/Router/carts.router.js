import axios from "axios";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cartModel from "../Schema/carts.schema.js";
import { generatedId } from "../util/cartUtils.js";

dotenv.config();

const router = express.Router();

router.put("/carts/updateCart", async (req, res) => {
    try {
        const { userid, bookid, count, quantity } = req.body;
        console.log(userid, bookid, count, quantity, `${process.env.NEXT_PUBLIC_API_Book}/${process.env.NEXT_PUBLIC_MAPPING_Book}/${bookid}`);
        const bookResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_Book}/${process.env.NEXT_PUBLIC_MAPPING_Book}/${bookid}`);
        console.log("Book Details fetched from Inventory");
        const book = bookResponse.data.object;
        if (book.quantity >= count) {
            let cart = await cartModel.findOne({ userId: userid });
            if (!cart) {
                cart = new cartModel({
                    _id: await generatedId(),
                    userId: userid,
                    books: [{
                        bookId: bookid,
                        count: count
                    }]
                });
                const created = await cart.save();
                console.log("Cart Created: ", created);
                return res.status(201).json({ success: true, message: "Cart Created Successfully", object: created, kind: "success" });
            }
            else {
                const dbBook = cart.books.find(
                    item => item.bookId.toString() === bookid
                )
                if (dbBook) {
                    dbBook.count = count;
                    if (dbBook.count <= 0) {
                        cart.books.pull(dbBook._id);
                    }
                }
                else {
                    cart.books.push({
                        bookId: bookid,
                        count: count
                    })
                }
                const updated = await cart.save();
                console.log("Cart Updated Successfully: ", updated);
                return res.status(201).json({ success: true, message: "Cart Updated Successfully", object: updated, kind: "success" })
            }
        }
        return res.status(409).json({ success: true, message: "Insufficient Quantity", object: null, kind: "error" });
    } catch (error) {
        console.error("Errorin updating Cart: ", error);
        return res.status(500).json({ success: true, message: error, object: null, kind: "success" });
    }
});

router.get("/carts/:userid", async (req, res) => {
    const { userid } = req.params;
    console.log("userid: " + userid);
    try {
        let carts = await cartModel.findOne({ userId: userid });
        console.log(carts);
        return res.status(200).json({ success: true, message: "Cart Fetched Successfully", object: carts, kind: "success" });
    } catch (error) {
        console.error("Error in fetching cart: ", error);
        return res.status(500).json({ success: true, message: error, object: null, kind: "success" });
    }

})

export default router;