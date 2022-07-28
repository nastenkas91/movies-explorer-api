const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');
const { movieNotFoundMessage, forbiddenMessage } = require('../utils/constants');

// поиск всех сохраненных пользователем карточек
module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

// создание фильма
module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create(
    {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    },
  )
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError(err.message));
      }
      return next(err);
    });
};

// удаление сохраненного фильма
module.exports.deleteMovie = (req, res, next) => {
  // const id = req.params.id;
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFound(movieNotFoundMessage);
      } else if (String(movie.owner) !== req.user._id) {
        throw new ForbiddenError(forbiddenMessage);
      }
      return Movie.findByIdAndRemove(req.params.id)
        .then((deletedMovie) => res.send(deletedMovie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError(movieNotFoundMessage));
      }
      return next(err);
    });
};
