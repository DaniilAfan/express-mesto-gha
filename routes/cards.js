const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

const {
  validateCreateCard,
  validateCardId,
} = require('../middlewares/requestValidation');

router.get('/cards', getCards);
router.post('/cards', validateCreateCard, createCard);
router.delete('/cards/:cardId', validateCardId, deleteCard);
router.put('/cards/:cardId/likes', validateCardId, putLike);
router.delete('/cards/:cardId/likes', validateCardId, deleteLike);

module.exports = router;
