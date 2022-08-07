const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');
const { STATUS_CODE_UNAUTHORIZED, STATUS_CODE_INTERNAL_SERVER_ERROR } = require('../utils/statusCodes');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      if (err.message === 'Неправильные почта или пароль') {
        res.status(STATUS_CODE_UNAUTHORIZED).send({ message: err.message });
        return;
      }

      res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};
