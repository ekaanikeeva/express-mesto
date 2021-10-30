const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(500).send({message: '500- Не удалось получить данные пользователей. Произошла ошибка'});
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.find(req.user)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({message: 'Невалидный id'});
      } else {
        res.status(500).send({message: '500- Не удалось получить данные пользователей. Произошла ошибка'});
      }
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        res.status(404).send({message: 'Пользователь не найден'});
      } return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({message: 'Невалидный id'});
      } else {
        res.status(500).send({message: '500- Не удалось получить данные пользователя. Произошла ошибка'});
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
        res.status(400).send({message: 'Переданы некорректные данные при создании пользователя'});
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        res.status(409).send({message: 'Этот email уже зарегистрирован'});
      } else res.status(500).send({message: '500- Не удалось получить данные пользователя. Произошла ошибка'});
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
        res.status(400).send({message: 'Пользователь не найден'});
      } return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Переданы некорректные данные при обновлении профиля'});
      } else res.status(500).send({message: 'Произошла ошибка'});
    })
    .catch(next);
};

module.exports.editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({message: 'Пользователь не найден'});
      } return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Переданы некорректные данные при обновлении профиля'});
      } else res.status(500).send({message: 'Произошла ошибка'});
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
