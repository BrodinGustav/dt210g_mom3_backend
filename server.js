require ("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//Importerar routes för API-anrop
const authRoutes = require("./Routes/authRoutes");
const BloggRoutes = require("./Routes/BloggRoutes");

const app = express();

//Använder port från .env, fallback om port ej fungerar
const port = process.env.PORT || 5000;

//Middleware
app.use(express.json());    //Tolkar JSON-data i inkommande förfrågningar
app.use(cors());            //Tillåter kors-anrop

//Definierar routes
app.use("/api/auth", authRoutes);
app.use("/api/blogg", BloggRoutes);

//Anslut till MongoDB
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)

        //Startar server
        app.listen(port, (err) => {
            if (err) {
                console.error("Fel vid start av server:", err);
            } else {
                console.log(`Server körs på port ${port}`);
                console.log("MongoDB ansluten!");
            }
        });
    } catch (err) {
        console.error("Fel vid anslutning", err.message);
        console.error("Stacktrace:", err.stack);
    }
};


startServer(); 