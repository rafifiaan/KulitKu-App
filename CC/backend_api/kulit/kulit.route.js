const { 
    getHomeData,
    getAllArtikel,
    getArtikelById
} = require("./kulit.controller");

const router = require("express").Router();

router.get("/home", getHomeData);
router.get("/artikel", getAllArtikel);
router.get("/artikel/:id_artikel", getArtikelById);

module.exports = router;