const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const auth = require('./middlewares/auth');
const userRouter = require('./routes/user');
const cardsRouter = require('./routes/card');
const { login, createUser } = require('./controllers/user');
const { validateUser, validateSignIn } = require('./middlewares/validate')
const { errors } = require('celebrate')
const app = express();

const { PORT = 3000 } = process.env;

app.use(cookieParser());
app.use(express.json());

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignIn, createUser);
app.use(auth);
app.use(userRouter);
app.use(cardsRouter);
app.use(errors());
app.use((err, req, res, next) => {
  res.status(500).send({ message: 'На сервере произошла ошибка'});
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT);
