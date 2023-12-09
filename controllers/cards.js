const cardModel = require('../models/card');

const getCards = (req, res) => {
  cardModel.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  cardModel.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: ' Переданы некорректные данные карточки' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка в id карты' });
        return;
      } if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Карточки нет в базе' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
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
        res.status(400).send({ message: 'Ошибка в id карты' });
        return;
      } if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Карточки нет в базе' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
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
        res.status(400).send({ message: 'Ошибка в id карты' });
        return;
      } if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Карточки нет в базе' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
