const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
// const BadRequest = require('../errors/BadRequest');

const validationLink = (value) => {
  // На let ругается линтер
  const result = validator.isURL(value);
  if (result) {
    return value;
  } throw new Error('URL validation err');
};

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(20),
  }),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validationLink).required(),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(validationLink).required(),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports = {
  validateUser,
  validateAvatar,
  validateCard,
  validateId,
  validateSignIn,
};
