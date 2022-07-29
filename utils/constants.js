const MONGO_DUPLICATE_ERROR_CODE = 11000;

const movieNotFoundMessage = 'Фильм по указанному id не найден';

const forbiddenMessage = 'Доступ ограничен';

const userNotFoundMessage = 'Пользователь по указанному id не найден';

const conflictingEmailMessage = 'Пользователь с данным email уже существует';

const authorisationErrorMessage = 'Неправильные почта или пароль';

const customValidationMessage = (field) => `Поле ${field} заполнено неверно`;

module.exports = {
  MONGO_DUPLICATE_ERROR_CODE,
  movieNotFoundMessage,
  forbiddenMessage,
  userNotFoundMessage,
  conflictingEmailMessage,
  authorisationErrorMessage,
  customValidationMessage,
};
