require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const { STATUS_CODE_NOT_FOUND, STATUS_CODE_INTERNAL_SERVER_ERROR } = require('./utils/statusCodes');

const { login } = require('./controllers/login');

const { createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});

app.post('/signin', login);

app.post('/signup', createUser);

app.use(auth);

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => res.status(STATUS_CODE_NOT_FOUND).send({ message: '404 Not Found' }));

app.use((err, req, res, next) => {
  const { statusCode = STATUS_CODE_INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === STATUS_CODE_INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${PORT}`);
});
