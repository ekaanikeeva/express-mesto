const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const auth = require('./middlewares/auth');
const userRouter = require('./routes/user');
const cardsRouter = require('./routes/card');
const { login, createUser } = require('./controllers/user');

const app = express();

const { PORT = 3000 } = process.env;

app.use(cookieParser());
app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use(userRouter);
app.use(cardsRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Не удалось получить данные' });
});
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT);
