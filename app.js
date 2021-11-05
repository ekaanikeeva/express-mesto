const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/user');
const cardsRouter = require('./routes/card');
const { login, createUser } = require('./controllers/user');
const { validateSignIn } = require('./middlewares/validate');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();
// const corsOptions = {
//   origin: '*',
//   optionsSuccessStatus: 200,
// };
app.use((req, res) => {
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

// Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

// Если это предварительный запрос, добавляем нужные заголовки
if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    return res.end();
}
})
// const allowedCors = [
//   'https://ekaanikeeva.nomoredomains.rocks',
//   'http://ekaanikeeva.nomoredomains.rocks',
//   'https://ekaanikeeva.backend.nomoredomains.rocks',
//   'http://ekaanikeeva.backend.nomoredomains.rocks',
// ];

// app.use((req, res, next) => {
//   const { origin } = req.headers;
//   const { method } = req;
//   const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', '*');
//   } if (method === 'OPTIONS') {
//     // разрешаем кросс-доменные запросы любых типов (по умолчанию)
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//   }
//   next();
// });
app.use(express.json());

app.use(cookieParser());

app.use(requestLogger);
app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignIn, createUser);
app.use(auth);
app.use(userRouter);
app.use(cardsRouter);
app.use(errorLogger);
app.use(errors());
app.use(() => {
  throw new NotFoundError({ message: '404- Ресурс не найден' });
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT);
