const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({
    likes: [],
    name,
    link,
    owner: _id,
    createdAt: new Date(Date.now()).toISOString(),
  })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => res.send({
      message: 'Пост удалён',
    }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
