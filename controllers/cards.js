const mongoose = require('mongoose');
const cardModel = require('../models/card');
const { BadRequestError } = require('../errors/badRequestError'); // 400
const { ForbiddenError } = require('../errors/forbiddenError'); // 403
const { NotFoundError } = require('../errors/notFoundError'); // 404

const getCards = (req, res, next) => {
  cardModel.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  cardModel.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные карточки'));
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  cardModel.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new ForbiddenError('Вы не можете удалять карточки другого пользователя'));
        return;
      }
      cardModel.deleteOne(card)
        .orFail()
        .then(() => {
          res.status(200).send(card);
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.CastError) {
            next(new BadRequestError('Ошибка в id карты'));
            return;
          } if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError('Карточки нет в базе'));
            return;
          }
          next(err);
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточки нет в базе'));
        return;
      }
      next(err);
    });
};

const putLike = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Ошибка в id карты'));
        return;
      } if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточки нет в базе'));
        return;
      }
      next(err);
    });
};

const deleteLike = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Ошибка в id карты'));
        return;
      } if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточки нет в базе'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
