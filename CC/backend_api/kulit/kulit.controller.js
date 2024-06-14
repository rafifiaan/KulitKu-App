const { 
    getFaktaById,
    getAllArtikel,
    getArtikelById
} = require("./kulit.service");

module.exports = {
    getAllArtikel: (req, res) => {
        getAllArtikel((err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: true,
                    message: 'Kesalahan server internal'
                });
            }
            return res.status(200).json({
                error: false,
                message: 'Semua Artikel berhasil dimuat!',
                listArtikel: results
            });
        });
    },

    getArtikelById: (req, res) => {
        const id_artikel = req.params.id_artikel;
        getArtikelById(id_artikel, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: true,
                    message: 'Kesalahan server internal'
                });
            }
            if (!results) {
                return res.status(404).json({
                    error: true,
                    message: 'Artikel tidak ditemukan'
                });
            }
            return res.status(200).json({
                error: false,
                message: 'Artikel berhasil ditemukan!',
                dataArtikel: results
            });
        });
    },    

    getHomeData: (req, res) => {
        let beritaArtikel, randomFakta;
        let errors = [];

        const sendResponse = () => {
            if (errors.length > 0) {
                return res.status(500).json({
                    error: true,
                    message: 'Kesalahan server internal'
                });
            }
            if (beritaArtikel && randomFakta) {
                return res.status(200).json({
                    error: false,
                    message: 'Selamat! Data Home berhasil dimuat',
                    data: {
                        fakta: randomFakta,
                        artikel: beritaArtikel
                    }
                });
            }
        };

        // Mengambil semua artikel
        getAllArtikel((err, artikelResult) => {
            if (err) {
                console.error(err);
                errors.push(err);
                sendResponse();
            } else {
                beritaArtikel = artikelResult;
                sendResponse();
            }
        });

        // Menghasilkan ID fakta acak
        const idFakta = Math.floor(Math.random() * 10) + 1;
        
        // Mengambil fakta berdasarkan ID
        getFaktaById(idFakta, (err, faktaResult) => {
            if (err) {
                console.error("Kesalahan:", err);
                errors.push(err);
                sendResponse();
            } else {
                randomFakta = faktaResult;
                sendResponse();
            }
        });
    }
};
