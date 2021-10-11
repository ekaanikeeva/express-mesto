const Card = require('../models/card');

// создать новую карточку
module.exports.createCard = (req, res) => {
  const creatorId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: creatorId })
    .then((card) => res.send(card))
    .catch(() => {
      res.status(500).send({ message: 'Не удалось добавить карточку' });
    });
};

// получить все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(500).send({ message: 'Карточки не получены' });
    });
};

// удалить карточку по id
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: '404 — Передан несуществующий _id карточки' });
      } else res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id ' });
      }
    });
};

// лайк
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
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
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id' });
      } else res.status(500).send({ message: 'Лайк не поставлен. Ошибка' });
    });
};

// дизлайк
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
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
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id' });
      } else res.status(500).send({ message: 'Лайк не поставлен. Ошибка' });
    });
};
