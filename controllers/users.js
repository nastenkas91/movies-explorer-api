const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const AuthorisationError = require('../errors/AuthorisationError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const { devSecretKey } = require('../utils/devConfig');
const { MONGO_DUPLICATE_ERROR_CODE } = require('../utils/constants');
const { userNotFoundMessage, conflictingEmailMessage, authorisationErrorMessage } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleUserDataError = (err) => {
  if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
    throw new ConflictError(conflictingEmailMessage);
  } if (err.name === 'ValidationError') {
    throw new ValidationError(err.message);
  }
};

// регистрация
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        email, password: hash, name,
      },
    ))
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => handleUserDataError(err))
    .catch(next);
};

// авторизация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorisationError(authorisationErrorMessage);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorisationError(authorisationErrorMessage);
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : devSecretKey, { expiresIn: '7d' });
          res.send({
            token,
          });
        });
    })
    .catch(next);
};

// получить информацию о пользователе
module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound(userNotFoundMessage);
      }
      return res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch(next);
};

// обновить информацию о пользователе
module.exports.updateMe = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFound(userNotFoundMessage);
      }
      return res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => handleUserDataError(err))
    .catch(next);
};
