const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const router = express.Router();

//Registrera användare
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        //Kontroll om användare finns
        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "Användarnamnet är upptaget. " });
        }

        //Hasha lösenord
        const hashedPassword = await bcrypt.hash(this.password, 10);

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
            res.status(400).json({ error: "Fel användarnamn eller lösenord" });
        }

        //Om allt ok, signera token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Inloggning lyckades!", token });
    } catch (error) {
        res.status(500).json({ error: "Serverfel" });
    }
});

module.exports = router;