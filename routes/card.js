const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

const { validateCard, validateId } = require('../middlewares/validate');

router.get('/cards', getCards);
router.post('/cards', validateCard, createCard);
router.delete('/cards/:_id', validateId, deleteCard);
router.put('/cards/:_id/likes', validateId, likeCard);
router.delete('/cards/:_id/likes', validateId, dislikeCard);

module.exports = router;
