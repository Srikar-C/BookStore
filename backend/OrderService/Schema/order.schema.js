import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    bookId: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    userId: {
        type: String,
        required: true
    },
    books: [orderItemSchema],
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

export default mongoose.model("Order", orderSchema);