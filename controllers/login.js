const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res
        .cookie('jwt', token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
          httpOnly: true,
        })
        .end();
    })
    .catch(next);
};
