//Importerar Express och skapar router-instans
const express = require("express");
const router = express.Router();

// Definiera dina rutter här
router.get('/', (req, res) => {
    res.json({ message: 'Välkommen till blogg API!' });
});

// Exportera router
module.exports = router;