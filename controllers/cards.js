const cardModel = require('../models/card');
const { CREATED_CODE } = require('../utils/constants');
const { BAD_REQUEST_ERROR_CODE } = require('../utils/constants');
const { NOT_FOUND_ERROR_CODE } = require('../utils/constants');
const { INTERNAL_SERVER_ERROR_CODE } = require('../utils/constants');

const getCards = (req, res) => {
  cardModel.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  cardModel.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(CREATED_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: ' Переданы некорректные данные карточки' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  cardModel.findByIdAndDelete(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Ошибка в id карты' });
        return;
      } if (err.message === 'NotValidId') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточки нет в базе' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const putLike = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Ошибка в id карты' });
        return;
      } if (err.message === 'NotValidId') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточки нет в базе' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteLike = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Ошибка в id карты' });
        return;
      } if (err.message === 'NotValidId') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточки нет в базе' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
