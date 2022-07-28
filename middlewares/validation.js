const { celebrate, Joi } = require('celebrate');
const { URL_REGEX } = require('../utils/constants');

const validateNewUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(URL_REGEX),
    trailerLink: Joi.string().required().pattern(URL_REGEX),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(URL_REGEX),
    movieId: Joi.number().required(),
    owner: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateNewUser,
  validateUserUpdate,
  validateLogin,
  validateMovie,
};
