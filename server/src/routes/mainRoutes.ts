import { Router } from "express";
import ShortUrl from "../models/shortUrl";
import { validateUrl, base62Encode } from "../utils";
import { authMiddleware } from "../middlewares";

const router = Router();
// Use Redis for this count cache
let cacheCounter = 1;

router.post("/create-url", authMiddleware, async (req, res) => {
    const { originalUrl } = req.body;
    if (!validateUrl(originalUrl)) {
        res.status(400).json({ error: "Invalid URL" });
        return;
    }
    try {
        const encodedCode = base62Encode(cacheCounter);
        cacheCounter += 1;
        console.log("Current url encoded code:", encodedCode);
        const shortUrl = new ShortUrl({
            original: originalUrl,
            short: encodedCode,
        });
        await shortUrl.save();
        req.user.shortUrl = shortUrl;
        res.status(201).json({
            originalUrl: shortUrl.original,
            shortUrl: shortUrl.short
        })
    } catch (error) {
        console.error("Error creating short URL:", error);
        res.status(500).json({ error: "Failed to create short url" });
    }
})

router.get("/:shortUrlCode", (req, res) => {
    const { shortUrlCode } = req.params;
    console.log(shortUrlCode);
    res.send("Redirecting to original URL");
})

export default router;