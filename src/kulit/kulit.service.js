const pool = require("../../config/databases.js");

// Random Fact
const getFaktaById = (id_fakta, callback) => {
    pool.query(
        'SELECT * FROM fakta WHERE id_fakta = ?',
        [id_fakta],
        (error, results, fields) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        }
    );
}

// Artikel Kulit
const getAllArtikel = (callback) => {
    pool.query(
        'SELECT id_artikel, judul_artikel, gambar_artikel, isi_artikel, sumber_artikel FROM artikel',
        [],
        (error, results, fields) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        }
    );
}

const getArtikelById = (id_artikel, callback) => {
    pool.query(
        'SELECT * FROM artikel WHERE id_artikel = ?',
        [id_artikel],
        (error, results, fields) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results[0]);
        }
    );
}

module.exports = {
    getFaktaById,
    getAllArtikel,
    getArtikelById
};
