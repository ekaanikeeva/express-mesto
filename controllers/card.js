const Card = require('../models/card');

const InternalServerError = require('../errors/InternalServerError');
const Forbidden = require('../errors/Forbidden');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');

// создать новую карточку
module.exports.createCard = (req, res, next) => {
  const creatorId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: creatorId })
    .then((card) => res.send(card))
    .catch(() => {
      throw new InternalServerError('Не удалось добавить карточку');
    })
    .catch(next);
};

// получить все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      throw new InternalServerError('Карточки не получены');
    })
    .catch(next);
};

// удалить карточку по id
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params._id)
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new Forbidden('Недостаточно прав для удаления этой карточки');
      }
      Card.findByIdAndRemove(req.params._id)
        .then((userCard) => {
          if (!userCard) {
            throw new NotFoundError('Передан несуществующий _id карточки');
          } else res.send(userCard);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            throw new BadRequest('Невалидный id');
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
        throw new NotFoundError('Передан несуществующий _id карточки');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Невалидный id');
      } else throw new InternalServerError('Лайк не поставлен. Ошибка');
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
        throw new NotFoundError('Передан несуществующий _id карточки');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Невалидный id');
      } else {
        throw new InternalServerError('Лайк не удален. Ошибка');
      }
    })
    .catch(next);
};
