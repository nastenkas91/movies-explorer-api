const router = require('express').Router();
const { validateNewUser, validateLogin } = require('../middlewares/validation');
const routerUsers = require('./users');
const routerMovies = require('./movies');
const URL_REGEX = require('../utils/constants');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFound');

router.post('/signup', validateNewUser, createUser);

router.post('/signin', validateLogin, login);

router.use('/users', auth, routerUsers);
router.use('/movies', auth, routerMovies);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
