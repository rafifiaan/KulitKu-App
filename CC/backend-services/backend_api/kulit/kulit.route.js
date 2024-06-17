const { 
    getHomeData,
    getAllArtikel,
    getArtikelById,
    getPenyakitById,
    getUserScanHistory
} = require("./kulit.controller");

const router = require("express").Router();
const { checkToken } = require('../../middleware/authentication.js');

router.get("/home", checkToken, getHomeData);
router.get("/artikel", checkToken, getAllArtikel);
router.get("/artikel/:id_artikel", checkToken, getArtikelById);

router.get("/penyakit/:id_penyakit", checkToken, getPenyakitById);

router.get('/history/:user_yang_scan', getUserScanHistory);

module.exports = router;