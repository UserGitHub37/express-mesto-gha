const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { SALT_ROUND } = require('../utils/config');

const {
  STATUS_CODE_CREATED,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_NOT_FOUND,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
} = require('../utils/statusCodes');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(() => res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Передан некорректный _id пользователя' });
        return;
      }
      res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(() => res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUND)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      return res.status(STATUS_CODE_CREATED).send(userData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      console.log(err.name);
      console.log(err.message);
      res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Передан некорректный _id пользователя' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((userAvatar) => res.send(userAvatar))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Передан некорректный _id пользователя' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};
