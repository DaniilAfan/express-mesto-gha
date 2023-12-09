const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const router = require('./routes/index');

const app = express();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Подключен к БД');
  });

app.use((req, res, next) => {
  req.user = {
    _id: '64f8a727f63d2122184f547a',
  };

  next();
});

app.use(helmet());

app.use(express.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`Приложение запущено, порт: ${PORT}`);
});
