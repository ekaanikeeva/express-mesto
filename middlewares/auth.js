const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'oneStrongSecret25');
  } catch (err) {
    throw new Unauthorized({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
