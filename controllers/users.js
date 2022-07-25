const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const AuthorisationError = require('../errors/AuthorisationError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');

const MONGO_DUPLICATE_ERROR_CODE = 11000;

const { NODE_ENV, JWT_SECRET } = process.env;

//регистрация
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
      email, password: hash, name
    },
      ))
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      email: user.email
    }))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        return next(new ConflictError('Пользователь с данным email уже существует'));
      } if (err.name === 'ValidationError') {
        const errMessage = err.message.replace('user validation failed:', '');
        return next(new ValidationError(`Переданы некорректные данные в полях:${errMessage}`));
      }
      return next(err);
    });
}

//авторизация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorisationError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorisationError('Неправильные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id}, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key', { expiresIn: '7d' });
          res.send({
            token,
          });
        });
    })
    .catch(next);
}

//получить информацию о пользователе
module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if(!user) {
        throw new NotFound('Пользователь по указанному id не найден');
      }
      return res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные.'));
      }
      return next(err);
    });
}

//обновить информацию о пользователе
module.exports.updateMe = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if(!user) {
        throw new NotFound('Пользователь по указанному id не найден');
      }
      return res.send({
        _id: user._id,
        name: user.name,
        email: user.email
      })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errMessage = err.message.replace('Validation failed:', '');
        return next(new ValidationError(`Переданы некорректные данные в полях:${errMessage}`));
      }
      return next(err);
    });
};
