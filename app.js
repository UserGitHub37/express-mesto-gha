require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const { PORT = 3000 } = process.env;

const app = express();

const PUBLIC_FOLDER = path.join(__dirname, 'public');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.static(PUBLIC_FOLDER));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
