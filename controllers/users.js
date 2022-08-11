const bcrypt = require('bcryptjs');
const escape = require('escape-html');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request-err');
const Conflict = require('../errors/conflict-err');

const { SALT_ROUND } = require('../utils/config');

const { STATUS_CODE_CREATED } = require('../utils/statusCodes');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      if (err.name === 'CastError') {
        next(new BadRequest('Передан некорректный _id пользователя'));
      }
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUND)
    .then((hash) => User.create({
      name: name ? escape(name) : undefined,
      about: about ? escape(about) : undefined,
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
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name: name ? escape(name) : name,
      about: about ? escape(about) : about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      if (err.name === 'CastError') {
        next(new BadRequest('Передан некорректный _id пользователя'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
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
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      if (err.name === 'CastError') {
        next(new BadRequest('Передан некорректный _id пользователя'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
      }
      next(err);
    });
};
