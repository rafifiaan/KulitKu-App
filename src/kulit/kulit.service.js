const pool = require("../../config/databases.js");

// Random Fact
const getFaktabyId = (id_fakta, callback) => {
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

module.exports = { getFaktabyId };
