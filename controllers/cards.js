const Card = require('../models/card');

const {
  STATUS_CODE_CREATED,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_UNAUTHORIZED,
  STATUS_CODE_NOT_FOUND,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
} = require('../utils/statusCodes');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
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
        res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (req.user._id !== card.owner._id.toString()) {
        throw new Error('Отсутствуют права на удаление карточки');
      }

      Card.findByIdAndRemove(req.params.cardId)
        .orFail()
        .then(() => res.send({
          message: 'Пост удалён',
        }))
        .catch(() => res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Передан некорректный _id карточки' });
        return;
      }
      if (err.message === 'Отсутствуют права на удаление карточки') {
        res.status(STATUS_CODE_UNAUTHORIZED).send({ message: 'Отсутствуют права на удаление карточки' });
        return;
      }
      res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
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
        res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
        return;
      }
      res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
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
        res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
        return;
      }
      res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};
