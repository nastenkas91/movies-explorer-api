const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');

//поиск всех сохраненных пользователем карточек
module.exports.getMovies = (req, res, next) => {
  const { owner } = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      return res.send(movies)
    })
    .catch(next);
}

//создание фильма
module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image,
    trailerLink, nameRU, nameEN, thumbnail, movieId } = req.body;
  const owner = req.user._id

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
    }
  )
    .then((movie) => {
      res.send({
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: movie.image,
        trailerLink: movie.trailerLink,
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
        thumbnail: movie.thumbnail,
        movieId: movie.movieId,
        owner: movie.owner,
        _id: movie._id
      })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errMessage = err.message.replace('user validation failed:', '');
        return next(new ValidationError(`Переданы некорректные данные в полях:${errMessage}`));
      }
      return next(err);
    });
}

//удаление сохраненного фильма
module.exports.deleteMovie = (req, res, next) => {
  // const id = req.params.id;
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Фильм по указанному id не найден')
      } else if (String(movie.owner) !== req.user._id) {
        throw new ForbiddenError('Доступ ограничен');
      }
      return Movie.findByIdAndRemove(req.params.id)
        .then((deletedMovie) => res.send({
          country: deletedMovie.country,
          director: deletedMovie.director,
          duration: deletedMovie.duration,
          year: deletedMovie.year,
          description: deletedMovie.description,
          image: deletedMovie.image,
          trailerLink: deletedMovie.trailerLink,
          nameRU: deletedMovie.nameRU,
          nameEN: deletedMovie.nameEN,
          thumbnail: deletedMovie.thumbnail,
          movieId: deletedMovie.movieId,
          owner: deletedMovie.owner,
          _id: deletedMovie._id
        }))
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Фильм по указанному id не найден'));
      }
      return next(err);
    });
}
