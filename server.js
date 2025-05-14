require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//Importerar routes för API-anrop
const authRoutes = require("./Routes/authRoutes");
const BloggRoutes = require("./Routes/BloggRoutes");
const validateRoutes = require("./Routes/validateRoutes");


const app = express();

//Använder port från .env, fallback om port ej fungerar
const port = process.env.PORT || 10000;


const corsOptions = {
    //origin: "https://dt210gmom3.netlify.app",  //Frontend-URL på Netlify (OBS JUSTERA TILLBAKA SENARE) KOLLA PORT!
        origin: "http://localhost:5173",  
    methods: ["GET", "POST", "PUT", "DELETE"],  //Metoder som tillåts
    allowedHeaders: ["Content-Type", "Authorization"],  //Tillåter specifika headers
    preflightContinue: false, //preflight-förfrågningar enligt error från Render
    optionsSuccessStatus: 204, //För äldre webbläsare
};


//Middleware
app.use(express.json());    //Tolkar JSON-data i inkommande förfrågningar
app.use(cors(corsOptions));            //Tillåter kors-anrop

//Definierar routes
app.use("/api/auth", authRoutes);
app.use("/api/blogg", BloggRoutes);
app.use("/api/validate", validateRoutes);

//Kontroll vilka anrop som hamnar på vilka routes
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});


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

app.get("/", (req, res) => {
    res.send("API is running...");
});

startServer(); 