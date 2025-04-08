import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("In API");
})

export default router;