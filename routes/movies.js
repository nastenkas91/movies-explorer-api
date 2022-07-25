const routerMovies = require('express').Router();
const { validateMovie } = require('../middlewares/validation');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

const URL_REGEX = require('../utils/constants');

routerMovies.get('/', getMovies);

routerMovies.post('/', validateMovie, createMovie);

routerMovies.delete('/:id', deleteMovie);

module.exports = routerMovies;
