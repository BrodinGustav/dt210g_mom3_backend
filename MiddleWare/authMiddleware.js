const jwt = require("jsonwebtoken");
require("dotenv").config();

//Lagrar token
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    //Debugg 
    console.log("Token mottagen:", token); 

    //Kontroll om token finns
    if(!token)
        return res.status(401).json({ error: "Åtkomst nekad: Ingen token skickad" });

    //Om ja, verifiera token till användare
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);

            //debugg
            console.log("Verifierad användare:", verified);

            req.user = verified;
            next();
        }catch (error) {
            //Debugg
            console.error("Fel vid tokenverifiering:", error); 
            
            res.status(400).json({ error: "Ogiltig token "});
        }
    };

    module.exports = authMiddleware;