//Importerar Express och skapar router-instans
const express = require("express");
const authMiddleware = require("../MiddleWare/authMiddleware");

const mongoose = require("mongoose");

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

//Skapa nytt inlägg
router.post("/", authMiddleware, async (req, res) => {
    try {

        console.log("Mottaget body:", req.body); // Logga inkommande data
        
        //Lagrar input-värden
        const { title, description } = req.body;

        //Validerar om alla fält finns med
        if (!title || !description ) {
            return res.status(400).json({ message: "Alla fält måste vara ifyllda" });
        }

        //Skapar nytt Todo-objekt
        const newBloggPost = new BloggPost({ title, description });

        //Sparar nytt Todo-objekt i databasen
        await newBloggPost.save();

        //Om ok, skicka tillbaka nytt Todo-objekt
        res.status(201).json(newBloggPost);

    } catch (error) {
        //Om error
        res.status(400).json({ message: "Fel vid skapande av inlägg" });
    }
});


//Uppdatera

router.put("/:id", authMiddleware, async (req, res) => {
    try {

        console.log(req.params.id);

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Ogiltigt ID-format" });
        }

        console.log("Anrop till PUT:", req.params.id);
        console.log("Body:", req.body);

        const updatedBloggPost = await BloggPost.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Om inget inlägg hittades
        if (!updatedBloggPost) {
            return res.status(404).json({ message: "Inlägg inte hittades" });
        } else
            res.json(updatedBloggPost);
    } catch (error) {
        res.status(400).json({ message: "Fel vid uppdatering av inlägg" });
        console.error("Fel från server:", errorData);
        throw new Error("Fel vid uppdatering av inlägg.");
    }
});


//Radera
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await BloggPost.findByIdAndDelete(req.params.id);
        res.json({ message: "Inlägg raderad" });
    } catch (error) {
        res.status(400).json({ message: "Fel vid radering av inlägg" });
        console.error("Fel från server:", error);
        throw new Error({ message: "Fel vid uppdatering av inlägg", error: error.message});
    }
});




module.exports = router; 