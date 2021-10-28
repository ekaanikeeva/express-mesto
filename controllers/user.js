const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => res.status(500).send({ message: '500- Не удалось получить данные пользователей. Произошла ошибка' }));
};

module.exports.getCurrentUser = (req, res) => {
  User.find(req.body)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id ' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      } return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id ' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }));
  User.create({
    name, about, avatar, email, password,
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные при создании пользователя',
          });
      } else res.status(500).send({ message: 'Не удалось добавить пользователя' });
    });
};

module.exports.editProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      } return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      } else res.status(500).send({ message: 'Возникла ошибка' });
    });
};

module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      } return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      } else res.status(500).send({ message: 'Возникла ошибка' });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'PrivateKey123456', { expiresIn: '7d' });

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
