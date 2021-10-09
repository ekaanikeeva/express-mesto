const Card = require('../models/card');

// создать новую карточку
module.exports.createCard = (req, res) => {
  const creatorId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: creatorId })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные при создании карточки',
          });
      } else res.status(500).send({ message: 'Не удалось добавить карточку' });
    });
};

// получить все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные при создании карточки',
          });
      }
      res.status(500).send({ message: 'Карточки не получены' });
    });
};

// удалить карточку по id
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((cards) => res.send(cards))
    .catch(() => res.status(404).send({ message: 'Карточка с указанным _id не найдена' }));
};

// лайк
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: '404 — Передан несуществующий _id карточки' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({
            message: '400 — Переданы некорректные данные для постановки лайка',
          });
      } else res.status(500).send({ message: 'Лайк не поставлен. Ошибка' });
    });
};

// дизлайк
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: '404 — Передан несуществующий _id карточки' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({
            message: '400 — Переданы некорректные данные для постановки лайка',
          });
      } else res.status(500).send({ message: 'Лайк не поставлен. Ошибка' });
    });
};
