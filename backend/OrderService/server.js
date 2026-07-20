import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OrderRouter from "./Router/order.router.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(OrderRouter);

mongoose
    .connect(process.env.NEXT_PUBLIC_API_Cart || "mongodb://localhost:27017/bookstore-order-service")
    .then((response) => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log("Error connecting to database", err);
    });


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
