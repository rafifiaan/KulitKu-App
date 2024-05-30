const { 
    checkUserExists,
    create, 
    getUserById, 
    getUsers, 
    updateUser, 
    deleteUser,
    getUserbyEmail, 
    truncateUsers
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
                    message: 'Database connection error'
                });
            }
    
            if (userExists.usernameExists) {
                return res.status(400).json({
                    error: true,
                    message: 'Username already exists'
                });
            }
    
            if (userExists.emailExists) {
                return res.status(400).json({
                    error: true,
                    message: 'Email already registered'
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
                            message: 'Failed to create user'
                        });
                    }
                }
                if (results.affectedRows > 0) {
                    return res.status(200).json({
                        error: false,
                        message: 'User Created'
                    });
                } else {
                    return res.status(500).json({
                        error: true,
                        message: 'Failed to create user'
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
                    message: 'Failed to fetch users'
                });
            }
            return res.json({
                error: false, 
                message: 'Users fetched successfully',
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
                    message: 'Failed to fetch user'
                });
            }
            if (!results) {
                return res.status(404).json({
                    error: true,
                    message: 'User not found'
                });
            }
            return res.json({
                error: false, 
                message: 'User found!',
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
                    message: 'Failed to update user'
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    error: true,
                    message: 'User not found or no changes made'
                });
            }
            return res.json({
                error: false,
                message: 'User updated successfully'
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
                        message: 'User not found'
                    });
                }
                return res.status(500).json({
                    error: true,
                    message: 'Failed to delete user'
                });
            }
            return res.json({
                error: false,
                message: 'User deleted successfully'
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
                    message: 'Login successful',
                    loginResult: {
                        userId: results.id_users,
                        name: results.username,
                        token: jsontoken
                    }
                });
            } else {
                console.error('Password mismatch for user:', results.email);
                return res.json({
                    error: true,
                    message: 'Invalid email or password'
                });
            }
        } catch (error) {
            console.error('Error in login:', error);
            return res.json({
                error: 0,
                message: 'Internal server error'
            });
        }
    },      
};
