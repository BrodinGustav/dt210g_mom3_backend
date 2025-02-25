//Importerar Express och skapar router-instans
const express = require("express");
const authMiddleware = require("../MiddleWare/authMiddleware");

//Importerar Blogg-modell
const BloggPost = require("../Models/Blogg");

const router = express.Router();

//Hämta alla inlägg
router.get("/", async (req, res) => {
    try {
        const blogg = await BloggPost.find();

        res.json(blogg);

    } catch (error) {
        res.status(500).json({ message: "Fel vid hämtning av inlägg " });
    }
});

//Hämta specifikt inlägg
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const blogg = await BloggPost.findById((req.params.id));

        res.json(blogg);

    } catch (error) {
        res.status(500).json({ message: "Fel vid hämtning av inlägg " });
    }
});



module.exports = router; 