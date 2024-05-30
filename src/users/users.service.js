const pool = require("../../config/databases.js");

const checkUserExists = (username, email, callback) => {
    pool.query(`SELECT COUNT(*) AS usernameCount, 
                (SELECT COUNT(*) FROM users WHERE email = ?) AS emailCount FROM users WHERE username = ?`,
        [email, username],
        (err, results, fields) => {
            if (err) {
                return callback(err, null);
            }
            const usernameExists = results[0].usernameCount > 0;
            const emailExists = results[0].emailCount > 0;

            return callback(null, { usernameExists, emailExists });
        }
    );
};

const create = (data, callback) => {
    // Regular expression untuk memeriksa alamat email yang berakhir dengan @gmail.com
    const gmailRegex = /@gmail\.com$/;

    // Memeriksa apakah alamat email sesuai dengan format yang diinginkan
    if (!gmailRegex.test(data.email)) {
        return callback({ 
            status: 400,
            message: 'The email address must end with @gmail.com' 
        }, null); // Mengembalikan kesalahan ke callback tanpa hasil
    }

    // Jika validasi lolos, melakukan query untuk menyimpan data ke dalam database
    pool.query(
        `INSERT INTO users(username, email, password) VALUES (?,?,?)`,
        [data.username, data.email, data.password],
        (error, results, fields) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        }
    );
};

const getUsers = (callback) => {
    pool.query(
        `SELECT id_users, username, email FROM users`,
        [],
        (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, results);
        }
    );
};

const getUserById = (id_users, callback) => {
    pool.query(
        `SELECT id_users, username, email FROM users WHERE id_users = ?`,
        [id_users],
        (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, results[0]);
        }
    );
};

const getUserbyEmail = async (email) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email],
            (error, results, fields) => {
                if (error) {
                    console.error('Error in getUserbyEmail query:', error);
                    reject(error);
                } else {
                    console.log('Results from getUserbyEmail:', results);
                    resolve(results[0]); // Assuming results is an array
                }
            }
        );
    });
};

const updateUser = (data, callback) => {
    pool.query(
        `UPDATE users SET username=?, email=?, password=? WHERE id_users=?`,
        [data.username, data.email, data.password, data.id_users],
        (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, results);
        }
    );
};

const deleteUser = (id_users, callback) => {
    pool.query(
        `DELETE FROM users WHERE id_users=?`,
        [id_users],
        (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            if (results.affectedRows === 0) {
                return callback({
                    message: 'User not found',
                    notFound: true
                });
            }
            callback(null, results);
        }
    );
};

module.exports = {
    checkUserExists,
    create,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserbyEmail
};
