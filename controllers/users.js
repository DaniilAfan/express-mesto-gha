const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const { userData } = require('../utils/userData');
const { BadRequestError } = require('../errors/badRequestError'); // 400
const { UnauthorizedError } = require('../errors/unauthorizedError'); // 401
const { NotFoundError } = require('../errors/notFoundError'); // 404
const { ConflictError } = require('../errors/conflictError'); // 409

const JWT_SECRET = 'most-secret-key';

const getUsers = (req, res, next) => {
  userModel
    .find({})
    .then((users) => {
      res.status(200).send({ data: users.map((user) => userData(user)) });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  userModel
    .findById(req.params.id)
    .orFail()
    .then((user) => {
      res.status(200).send({ data: userData(user) });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
        return;
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => userModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({ data: userData(user) });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
        return;
      }
      if (err.code === 11000) {
        next(
          new ConflictError('Пользователь с таким email уже зарегистрирован'),
        );
        return;
      }
      next(err);
    });
};

const updateUserById = (req, res, next) => {
  const { name, about } = req.body;
  userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .orFail()
    .then((user) => {
      res.status(200).send({ data: userData(user) });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
        return;
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      next(err);
    });
};

const updateAvatarById = (req, res, next) => {
  const { avatar } = req.body;
  userModel
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
    .orFail()
    .then((user) => {
      res.status(200).send({ data: userData(user) });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
        return;
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  userModel
    .findOne({ email })
    .select('+password')
    .orFail()
    .then((user) => {
      bcrypt.compare(password, user.password).then((isValid) => {
        if (!isValid) {
          next(new UnauthorizedError('Неверный логин или пароль'));
          return;
        }
        const payload = { _id: user._id };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        res
          .cookie('token', token, { httpOnly: true })
          .status(200)
          .send({ message: 'Авторизация прошла успешно' });
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new UnauthorizedError('Неверный логин или пароль'));
        return;
      }
      next(err);
    });
};
const getCurrentUser = (req, res, next) => {
  userModel
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      // Добавил действие по умолчанию: отправка данных пользователя
      res.status(200).send({ data: userData(user) });
    })
    .catch(next);
};
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAvatarById,
  login,
  getCurrentUser,
};
