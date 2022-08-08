const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request-err');
const Unauthorized = require('../errors/unauthorized-err');

const { STATUS_CODE_CREATED } = require('../utils/statusCodes');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({
    name,
    link,
    owner: _id,
  })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(STATUS_CODE_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (req.user._id !== card.owner._id.toString()) {
        next(new Unauthorized('Отсутствуют права на удаление карточки'));
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
      }
      if (err.name === 'CastError') {
        next(new BadRequest('Передан некорректный _id карточки'));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }, // обработчик then получит на вход обновлённую запись
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки/снятии лайка'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }, // обработчик then получит на вход обновлённую запись
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки/снятии лайка'));
      }
      next(err);
    });
};
