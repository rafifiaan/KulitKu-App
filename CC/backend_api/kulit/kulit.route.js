const { 
    getHomeData,
    getAllArtikel,
    getArtikelById,
    getPenyakitById
} = require("./kulit.controller");

const router = require("express").Router();

router.get("/home", getHomeData);
router.get("/artikel", getAllArtikel);
router.get("/artikel/:id_artikel", getArtikelById);

router.get("/penyakit/:id_penyakit", getPenyakitById);

module.exports = router;