import { Router } from "express";
import ShortUrl from "../models/shortUrl";
import { validateUrl, base62Encode, getLastCacheCounter } from "../utils";
import { authMiddleware } from "../middlewares";

const router = Router();
let cacheCounter = 0;
(async () => {
    try {
        cacheCounter = await getLastCacheCounter();
        console.log(`Count cache initialized at: ${cacheCounter}`);
    } catch (err) {
        console.error("Failed to init count cache, using default value:", err);
    }
})();

router.get("/about", authMiddleware, async (req, res) => {
    try {
        const urlsData = await req.user.populate("urls");
        res.status(200).json({
            urlsData: urlsData.urls
        });
    } catch (error) {
        console.error("Error fetching URLs:", error);
        res.status(500).json({ error: "Failed to fetch URLs" });
    }
})

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
        req.user.urls.push(shortUrl._id);
        await req.user.save();
        console.log("Short URL created:", shortUrl);

        res.status(201).json({
            originalUrl: shortUrl.original,
            shortUrl: shortUrl.short
        })
    } catch (error) {
        console.error("Error creating short URL:", error);
        res.status(500).json({ error: "Failed to create short url" });
    }
})

router.get("/:shortUrlCode", async (req, res) => {
    try {
        const { shortUrlCode } = req.params;
        const shortUrl = await ShortUrl.findOne({ short: shortUrlCode }).exec();
        if (!shortUrl) {
            res.status(404).json({ error: "Short URL not found" });
            return;
        }
        shortUrl.clicks += 1;
        await shortUrl.save();
        console.info("Redirecting to original URL:", shortUrl.original);
        res.redirect(shortUrl.original);
    } catch (error) {
        console.log("Error fetching short URL:", error);
        res.status(500).json({ error: "Failed to fetch short url" });
    }
})

export default router;