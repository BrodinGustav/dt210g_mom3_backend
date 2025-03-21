const express = require("express");
const User = require("../Models/User");
const authMiddleware = require("../MiddleWare/authMiddleware");

const router = express.Router();


//Kontroll om token finns (gäller vid omladdning av sida för fronten)
router.get("/", authMiddleware, async (req, res) => {
    try {

        //debugg
        console.log("Validating user...");

        const userId = req.user?.userId; 

        //debugg
        console.log("User ID:", userId);

        if (!userId) {
            return res.status(401).json({ message: "Ingen token eller ogiltig token" });
        }

        const user = await User.findById(userId); 
        if (!user) {

            //debugg
            console.error("Användare hittades inte i databasen");

            return res.status(404).json({ message: "Användare hittades inte" });
        }

        //debugg
        console.log("Användare hittad:", user);

        res.json({ user });
    } catch (error) {

        //debugg
        console.error("Fel vid hämtning av användare:", error);

        res.status(500).json({ message: "Fel vid hämtning av specifik användare" });
    }
});

module.exports = router;