const jwt = require("jsonwebtoken");

//Lagrar token
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    //Kontroll om token finns
    if(!token)
        return res.status(401).json({ error: "Åtkomst nekad:" });

    //Om ja, verifiera token till användare
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verified;
            next();
        }catch (error) {
            res.status(400).json({ error: "Ogiltig token "});
        }
    };

    module.exports = authMiddleware;