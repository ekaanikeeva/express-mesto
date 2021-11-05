const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/user');
const cardsRouter = require('./routes/card');
const { login, createUser } = require('./controllers/user');
const { validateSignIn } = require('./middlewares/validate');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

const { PORT = 3000 } = process.env;

const allowedCors = [
  'https://ekaanikeeva.nomoredomains.rocks',
  'http://ekaanikeeva.nomoredomains.rocks',
  'http://localhost:3000',
  'https://ekaanikeeva.backend.nomoredomains.rocks',
  'http://ekaanikeeva.backend.nomoredomains.rocks',
  'https://ekaanikeeva.backend.nomoredomains.rocks/cards',
  'https://ekaanikeeva.backend.nomoredomains.rocks/users/me',

];

const corsOption = {
  credentials: true,
  origin: function checkCorsList(origin, callback) {
    if (allowedCors.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};


app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOption));
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
