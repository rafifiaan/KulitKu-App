const { 
    checkUserExists,
    create, 
    getUserById, 
    getUsers, 
    updateUser, 
    deleteUser,
    getUserbyEmail
} = require('./users.service');

const bcrypt = require('bcrypt');

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

const { sign } = require('jsonwebtoken');

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        checkUserExists(body.username, body.email, (err, userExists) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: true,
                    message: 'Kesalahan koneksi basis data'
                });
            }
    
            if (userExists.usernameExists) {
                return res.status(400).json({
                    error: true,
                    message: 'Nama pengguna sudah ada'
                });
            }
    
            if (userExists.emailExists) {
                return res.status(400).json({
                    error: true,
                    message: 'Email sudah terdaftar'
                });
            }
    
            // Jika username dan email belum terdaftar, lanjutkan dengan membuat pengguna
            const hashedPassword = hashPassword(body.password);
            body.password = hashedPassword;
            
            // Panggil fungsi create dengan callback
            create(body, (err, results) => {
                if (err) {
                    if (err.status === 400) {
                        console.error(err.message);
                        return res.status(400).json({
                            error: true,
                            message: err.message
                        });
                    } else {
                        console.error(err);
                        return res.status(500).json({
                            error: true,
                            message: 'Gagal membuat Akun'
                        });
                    }
                }
                if (results.affectedRows > 0) {
                    return res.status(200).json({
                        error: false,
                        message: 'Akun berhasil dibuat!'
                    });
                } else {
                    return res.status(500).json({
                        error: true,
                        message: 'Gagal membuat Akun'
                    });
                }
            });
        });
    },
    getUsers: (req, res) => {
        getUsers((err, results) => {
            if(err) {
                console.error(err);
                return res.status(500).json({
                    error: true,
                    message: 'Gagal mendapatkan data pengguna'
                });
            }
            return res.json({
                error: false, 
                message: 'Berhasil mendapatkan data pengguna!',
                listUsers: results
            });
        });
    },
    getUserById: (req, res) => {
        const id_users = req.params.id_users;
        getUserById(id_users, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: true,
                    message: 'Gagal mendapatkan data pengguna'
                });
            }
            if (!results) {
                return res.status(404).json({
                    error: true,
                    message: 'Akun tidak ditemukan'
                });
            }
            return res.json({
                error: false, 
                message: 'Berhasil menemukan Akun Pengguna!',
                dataUser: results
            });
        });
    },
    updateUser: (req, res) => {
        const id_users = req.params.id_users;
        const body = req.body;  
        body.password = hashPassword(body.password);
    
        updateUser({ id_users, ...body }, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: true,
                    message: 'Gagal memperbarui data pengguna'
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    error: true,
                    message: 'Akun tidak ditemukan atau tidak ada perubahan yang dilakukan'
                });
            }
            return res.json({
                error: false,
                message: 'Berhasil memperbarui Akun pengguna!'
            });
        });
    },    
    deleteUser: (req, res) => {
        const id_users = req.params.id_users;
        deleteUser(id_users, (err) => {
            if (err) {
                console.error(err);
                if (err.notFound) {
                    return res.status(404).json({
                        error: true,
                        message: 'Akun tidak ditemukan'
                    });
                }
                return res.status(500).json({
                    error: true,
                    message: 'Gagal menghapus data pengguna'
                });
            }
            return res.json({
                error: false,
                message: 'Berhasil menghapus Akun pengguna!'
            });
        });
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log(`Email: ${email}, Password: ${password}`);
    
            const results = await getUserbyEmail(email);
    
            const passwordMatch = await bcrypt.compare(password, results.password);
            console.log(passwordMatch);
            console.log(results.password);
    
            if (passwordMatch) {
                results.password = undefined;
                const jsontoken = sign({ result: results }, process.env.SECRET_KEY, {
                    expiresIn: '1h'
                });
    
                return res.json({
                    error: false,
                    message: 'Selamat! Login Berhasil',
                    loginResult: {
                        userId: results.id_users,
                        name: results.username,
                        token: jsontoken
                    }
                });
            } else {
                console.error('Ketidakcocokan kata sandi untuk pengguna:', results.email);
                return res.json({
                    error: true,
                    message: 'Email atau kata sandi tidak valid'
                });
            }
        } catch (error) {
            console.error('Kesalahan saat masuk:', error);
            return res.json({
                error: 0,
                message: 'Kesalahan server internal'
            });
        }
    },      
};
