const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const Unauthorized = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;

  if (!token) {
    next(new Unauthorized('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
