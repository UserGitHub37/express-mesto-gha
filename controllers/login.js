const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');
const Unauthorized = require('../errors/unauthorized-err');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      if (err.message === 'Неправильные почта или пароль') {
        next(new Unauthorized(err.message));
      }
      next(err);
    });
};
