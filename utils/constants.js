const URL_REGEX = /^(https?:\/\/(www\.)?([a-zA-z0-9-]{1}[a-zA-z0-9-]*\.?)*\.{1}([a-zA-z0-9]){2,8}(\/?([a-zA-z0-9-])*\/?)*\/?([-._~:?#[]@!\$&'\(\)\*\+,;=])*)/;

const MONGO_DUPLICATE_ERROR_CODE = 11000;

const movieNotFoundMessage = 'Фильм по указанному id не найден';

const forbiddenMessage = 'Доступ ограничен';

const userNotFoundMessage = 'Пользователь по указанному id не найден';

const conflictingEmailMessage = 'Пользователь с данным email уже существует';

const authorisationErrorMessage = 'Неправильные почта или пароль';

const customValidationMessage = (field) => `Поле ${field} заполнено неверно`;

module.exports = {
  URL_REGEX,
  MONGO_DUPLICATE_ERROR_CODE,
  movieNotFoundMessage,
  forbiddenMessage,
  userNotFoundMessage,
  conflictingEmailMessage,
  authorisationErrorMessage,
  customValidationMessage,
};
