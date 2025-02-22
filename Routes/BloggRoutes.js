//Importerar Express och skapar router-instans
const express = require("express");
const router = express.Router();

//Importerar Blogg-modell
const Blogg = require("./Models/Blogg");

//Hämta alla inlägg
router.get("/", async (req, res) => {
    try {
        const blogg = await Blogg.find();

        res.json(blogg);

    } catch (error) {
        res.status(500).json({ message: "Fel vid hämtning av inlägg " });
    }
});

//Hämta specifikt inlägg
router.get("/:id", async (req, res) => {
    try {
        const blogg = await Blogg.findById((req.params.id));

        res.json(blogg);

    } catch (error) {
        res.status(500).json({ message: "Fel vid hämtning av inlägg " });
    }
});

//Skapa nytt inlägg
router.post("/", async (req, res) => {
    try {

        console.log("Mottaget body:", req.body); // Logga inkommande data
        
        //Lagrar input-värden
        const { title, description } = req.body;

        //Validerar om alla fält finns med
        if (!title || !description ) {
            return res.status(400).json({ message: "Alla fält måste vara ifyllda" });
        }

        //Skapar nytt Todo-objekt
        const newBlogg = new Blogg({ title, description });

        //Sparar nytt Todo-objekt i databasen
        await newBlogg.save();

        //Om ok, skicka tillbaka nytt Todo-objekt
        res.status(201).json(newBlogg);

    } catch (error) {
        //Om error
        res.status(400).json({ message: "Fel vid skapande av inlägg" });
    }
});


router.put("/:id", async (req, res) => {
    try {

        console.log("Anrop till PUT:", req.params.id);
        console.log("Body:", req.body);

        const updatedBlogg = await Blogg.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Om inget inlägg hittades
        if (!updatedBlogg) {
            return res.status(404).json({ message: "Inlägg inte hittades" });
        } else
            res.json(updatedBlogg);
    } catch (error) {
        res.status(400).json({ message: "Fel vid uppdatering av inlägg" });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        await Blogg.findByIdAndDelete(req.params.id);
        res.json({ message: "Inlägg raderad" });
    } catch (error) {
        res.status(400).json({ message: "Fel vid radering av inlägg" });
    }
});


module.exports = router; 