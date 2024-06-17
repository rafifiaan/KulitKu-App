const { 
    createUser, 
    getUserById, 
    getUsers, 
    updateUser, 
    deleteUser,
    login 
} = require('./users.controller.js');

const router = require('express').Router();
const { checkToken } = require('../../middleware/authentication.js');

router.get('/users', getUsers);
router.get('/users/:id_users', checkToken, getUserById);
router.post('/register', createUser);
router.post('/login', login);

router.patch('/users/update/:id_users', updateUser);
router.delete('/users/delete/:id_users', deleteUser);

module.exports = router;