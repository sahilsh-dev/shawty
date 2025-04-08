import { create } from "domain";
import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
    original: {
        type: String,
        required: true,
    },
    short: {
        type: String,
        required: true,
        unique: true,
    }, 
    clicks: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);
export default ShortUrl;