const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const authMiddleware = require("../MiddleWare/authMiddleware");
require("dotenv").config();


const router = express.Router();

//Registrera användare
router.post("/register", async (req, res) => {
    try {
        const { email, password, firstName } = req.body;

        console.log(req.body);

        //Validera input
        if(!email || !password || !firstName) {
            return res.status(400).json({error: "Felaktigt input, skicka email, lösenord och namn"});
        }

        //Kontroll om användare finns
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ error: "email är upptaget. " });
        }

        //Hasha lösenord
        const hashedPassword = await bcrypt.hash(password, 10);

        //Spara användare
        user = new User({ email, firstName, password: hashedPassword });

        console.log(user);

        await user.save();

        console.log("JWT_SECRET:", process.env.JWT_SECRET);

           //Skapa en token med JWT
           const token = jwt.sign(
            { userId: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" } 
        );

        res.json({ 
            message: "Registrering lyckades!", 
            token:  token,
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName
            }
        });

    } catch (error) {

        console.error("Error during registration:", error); 
        res.status(500).json({ 
            error: "Serverfel",
            message: error.message, 
            stack: error.stack  
        });
    }
});

//Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Loggar in Användare med mail: " + email )

        const user = await User.findOne({ email });

        //Kontroll om användare finns
        if (!user) {
            return res.status(400).json({ error: "Fel email eller lösenord " });
        }

        //Kontroll om lösenord stämmer
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ error: "Fel användarnamn eller lösenord" });
        }

        //Om allt ok, signera token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "8h" });

        res.json({ message: "Inloggning lyckades!", token, user });
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


//Uppdatera användare
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

//Radera användare
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Användare raderad" });
    } catch (error) {
        res.status(400).json({ message: "Fel vid radering av användare" });
    }
});




module.exports = router;