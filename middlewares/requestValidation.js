const { celebrate, Joi } = require('celebrate');

const urlRegExp = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(20),
    avatar: Joi.string().pattern(urlRegExp),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
});

const validateGetUserById = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

const validateUpdateUserById = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(20),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validateUpdateAvatarById = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegExp).required(),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(urlRegExp).required(),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateGetUserById,
  validateUpdateUserById,
  validateUpdateAvatarById,
  validateCreateCard,
  validateCardId,
};
