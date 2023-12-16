const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const handleError = require('./middlewares/handleError');

const app = express();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Подключен к БД');
});

app.use(helmet());
app.use(express.json());

app.use(cookieParser());
app.use(router);
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Приложение запущено, порт: ${PORT}`);
});
