const routerUsers = require('express').Router();
const { getMe, updateMe } = require('../controllers/users');
const { validateUserUpdate } = require('../middlewares/validation');

routerUsers.get('/me', getMe);

routerUsers.patch('/me', validateUserUpdate, updateMe);

module.exports = routerUsers;
