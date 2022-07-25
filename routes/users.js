const routerUsers = require('express').Router();
const { getMe, updateMe } = require('../controllers/users');

routerUsers.get('/me', getMe);

routerUsers.patch('/me', updateMe);

module.exports = routerUsers;
