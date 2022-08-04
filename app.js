require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const { STATUS_CODE_NOT_FOUND } = require('./utils/statusCodes');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});

app.use((req, res, next) => {
  req.user = {
    _id: '62deba63ce4536117ef6d466',
  };

  next();
});

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => res.status(STATUS_CODE_NOT_FOUND).send({ message: '404 Not Found' }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${PORT}`);
});
