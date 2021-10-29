const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const InternalServerError = require('../errors/InternalServerError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const ConflictingRequest = require('../errors/ConflictingRequest');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      throw new InternalServerError('500- Не удалось получить данные пользователей. Произошла ошибка');
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.find(req.user)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Невалидный id');
      } else {
        throw new InternalServerError('500- Не удалось получить данные пользователей. Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Невалидный id');
      } else {
        throw new InternalServerError('500- Не удалось получить данные пользователя. Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при создании пользователя');
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        throw new ConflictingRequest('Этот email уже зарегистрирован');
      } else throw new InternalServerError('500- Не удалось получить данные пользователя. Произошла ошибка');
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports.editProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при обновлении профиля');
      } else throw new InternalServerError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при обновлении профиля');
      } else throw new InternalServerError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'oneStrongSecret25', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ token });
    })
    .catch(next);
};
