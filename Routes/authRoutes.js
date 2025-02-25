const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const BloggPost = require("../Models/Blogg");
const authMiddleware = require("../MiddleWare/authMiddleware");


const router = express.Router();

//Registrera användare
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        //Validera input
        if(!username || !password) {
            return res.status(400).json({error: "Felaktigt input, skicka användarnamn och lösenord"});
        }

        //Kontroll om användare finns
        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "Användarnamnet är upptaget. " });
        }

        //Hasha lösenord
        const hashedPassword = await bcrypt.hash(password, 10);

        //Spara användare
        user = new User({ username, password: hashedPassword });
        await user.save();

        res.json({ message: "Registrering lyckades!" });
    } catch (error) {
        res.status(500).json({ error: "Serverfel" });
    }
});

//Login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        //Kontroll om användare finns
        if (!user) {
            return res.status(400).json({ error: "Fel användarnamn eller lösenord " });
        }

        //Kontroll om lösenord stämmer
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ error: "Fel användarnamn eller lösenord" });
        }

        //Om allt ok, signera token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Inloggning lyckades!", token });
    } catch (error) {
        res.status(500).json({ error: "Serverfel" });
    }
});


/***CRUD GÄLLANDE USER ***/


//Hämta alla användare
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.find();

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: "Fel vid hämtning av användare " });
    }
});

//Hämta specifik användare
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById((req.params.id));

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: "Fel vid hämtning av specifik användare " });
    }
});



router.put("/:id", authMiddleware, async (req, res) => {
    try {

        console.log("Anrop till PUT:", req.params.id);
        console.log("Body:", req.body);

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Om ingen användare hittades
        if (!updatedUser) {
            return res.status(404).json({ message: "Ingen användare hittades" });
        } else
            res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: "Fel vid uppdatering av användare" });
    }
});


router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Användare raderad" });
    } catch (error) {
        res.status(400).json({ message: "Fel vid radering av användare" });
    }
});


/***CRUD GÄLLANDE BLOGGINLÄGG ***/

//Skapa nytt inlägg
router.post("/bloggPost", authMiddleware, async (req, res) => {
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


router.put("/bloggPost/:id", authMiddleware, async (req, res) => {
    try {

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
    }
});


router.delete("/bloggPost/:id", authMiddleware, async (req, res) => {
    try {
        await BloggPost.findByIdAndDelete(req.params.id);
        res.json({ message: "Inlägg raderad" });
    } catch (error) {
        res.status(400).json({ message: "Fel vid radering av inlägg" });
    }
});


module.exports = router;