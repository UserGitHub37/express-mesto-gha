const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator(v) {
        return isEmail(v);
      },
      message: 'Не валидный адрес электронной почты',
    },
    unique: true,
  },
  password: {
    type: String,
  },
});

module.exports = mongoose.model('user', userSchema);
