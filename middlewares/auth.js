const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../utils/config');

const { STATUS_CODE_UNAUTHORIZED } = require('../utils/statusCodes');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(STATUS_CODE_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(STATUS_CODE_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
