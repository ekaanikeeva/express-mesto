const Card = require('../models/card');

// создать новую карточку
module.exports.createCard = (req, res, next) => {
  const creatorId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: creatorId })
    .then((card) => res.send(card))
    .catch(() => {
      res.status(500).send({message: 'Не удалось добавить карточку'});
    })
    .catch(next);
};

// получить все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(500).send({message: 'Карточки не получены'});
    })
    .catch(next);
};

// удалить карточку по id
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params._id)
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
      return res.status(403).send({message: 'Недостаточно прав для удаления этой карточки'});
      }
      Card.findByIdAndRemove(req.params._id)
        .then((userCard) => {
          if (!userCard) {
            res.status(404).send({message: 'Невалидный id'});
          } else res.send(userCard);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            res.status(404).send({message: 'Невалидный id'});
          }
        });
    })
    .catch(next);
};

// лайк
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({message: 'Невалидный id'});
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({message: 'Невалидный id'});
      } else res.status(500).send({message: 'Лайк не поставлен. Ошибка'});
    })
    .catch(next);
};

// дизлайк
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({message: 'Невалидный id'});
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({message: 'Невалидный id'});
      } else {
        res.status(500).send({message: 'Лайк не удален. Ошибка'});
      }
    })
    .catch(next);
};
