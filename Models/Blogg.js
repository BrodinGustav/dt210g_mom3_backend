//Importerar mongoose
const mongoose = require("mongoose");

//Skapar schema
const BloggSchema = new mongoose.Schema({
    
    title: { type: String, required: true, minlength: 3 },

    description: { type: String, required: true, maxlength: 200 },

    //Automatiska createdAt och updatedAt-fält
}, { timestamps: true });

//Exporterar modell
module.exports = mongoose.model("Blogg", BloggSchema);
