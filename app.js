const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const cardsRouter = require('./routes/card');

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '615ec84e34f958002d6de319',
  };
  next();
});
app.use(userRouter);
app.use(cardsRouter);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.listen(PORT);
