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
        const blogg = await BloggPost.find().populate("author", "firstName"); //Hämtar användarnamn;

        res.json(blogg);

    } catch (error) {
        res.status(500).json({ message: "Fel vid hämtning av inlägg " });
    }
});


//Hämta specifikt inlägg
router.get("/:id", async (req, res) => {
    try {

        const bloggPostId = req.params.id;
        
        // Omvandla till MongoDB ObjectId om det inte redan är rätt format
        if (!mongoose.Types.ObjectId.isValid(bloggPostId)) {
            return res.status(400).json({ message: 'Ogiltigt ID format' });
        }

        const blogg = await BloggPost.findById(req.params.id).populate("author", "firstName");

        if (!blogg) {
            return res.status(404).json({ message: "Bloggposten hittades inte" });
        }

        res.json(blogg);

        //debugg
        console.log("Skickar tillbaka bloggpost:", blogg);

    } catch (error) {
        console.error("Fel vid hämtning av bloggpost:", error);
        res.status(500).json({ message: "Fel vid hämtning av inlägg", error: error.message });
    }
});

//Skapa nytt inlägg
router.post("/", authMiddleware, async (req, res) => {
    try {

        console.log("Mottaget body:", req.body); // Logga inkommande data
        
        console.log(req.user);

        //Lagrar input-värden
        const { title, description } = req.body;    

        if (!req.user) {
            return res.status(400).json({ message: "Ingen användare inloggad" });
        }


        //Validerar om alla fält finns med
        if (!title || !description ) {
            return res.status(400).json({ message: "Alla fält måste vara ifyllda" });
        }

        console.log("req.user:", req.user);

        //Skapar nytt blogg-objekt
        const newBloggPost = new BloggPost({ title, description,  author: req.user.userId }); //Kopplar inlägg till den inloggade användaren

        //Sparar nytt blogg-objekt i databasen
        await newBloggPost.save();

        //Om ok, skicka tillbaka nytt blogg-objekt
        res.status(201).json(newBloggPost);

    } catch (error) {
        //Om error
        console.error("Fel vid skapande av inlägg:", error);
        res.status(400).json({ message: "Fel vid skapande av inlägg",  error: error.message });
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

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Ogiltigt ID-format" });
        }

        console.log("Anrop till PUT:", req.params.id);

        console.log("Body:", req.body);


        await BloggPost.findByIdAndDelete(req.params.id);
        res.json({ message: "Inlägg raderad" });

    } catch (error) {
        res.status(400).json({ message: "Fel vid radering av inlägg" });
        console.error("Fel från server:", error);
        throw new Error({ message: "Fel vid uppdatering av inlägg", error: error.message});
    }
});




module.exports = router; 