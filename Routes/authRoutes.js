const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");


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

        res.json({ message: hashedPassword });

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



//Hämta alla användare
router.get("/", authMiddleware async (req, res) => {
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


module.exports = router;