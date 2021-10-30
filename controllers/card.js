const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const IntervalServerError = require('../errors/Unauthorized');
const Forbidden = require('../errors/Forbidden');

// создать новую карточку
module.exports.createCard = (req, res, next) => {
  const creatorId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: creatorId })
    .then((card) => res.send(card))
    .catch(() => {
      throw new IntervalServerError({ message: 'Не удалось добавить карточку' });
    })
    .catch(next);
};

// получить все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      throw new IntervalServerError({ message: 'Карточки не получены' });
    })
    .catch(next);
};

// удалить карточку по id
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params._id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: 'Невалидный id' });
      }
      if (card.owner.toString() !== req.user._id) {
        throw new Forbidden({ message: 'Недостаточно прав для удаления этой карточки' });
      }
      Card.findByIdAndRemove(req.params._id)
        .then((userCard) => res.send(userCard))
        .catch(next);
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
        throw new NotFoundError({ message: 'Невалидный id' });
      } return res.send(card);
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
        throw new NotFoundError({ message: 'Невалидный id' });
      } res.send(card);
    })
    .catch(next);
};
