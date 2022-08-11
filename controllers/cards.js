const escape = require('escape-html');

const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request-err');
const Forbidden = require('../errors/forbidden-err');

const { STATUS_CODE_CREATED } = require('../utils/statusCodes');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({
    name: escape(name),
    link,
    owner: _id,
  })
    .then((card) => res.status(STATUS_CODE_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (req.user._id !== card.owner._id.toString()) {
        next(new Forbidden('Отсутствуют права на удаление карточки'));
        return;
      }

      Card.findByIdAndRemove(req.params.cardId)
        .orFail()
        .then(() => res.send({
          message: 'Пост удалён',
        }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Передан некорректный _id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }, // обработчик then получит на вход обновлённую запись
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки/снятии лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }, // обработчик then получит на вход обновлённую запись
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки/снятии лайка'));
      } else {
        next(err);
      }
    });
};
