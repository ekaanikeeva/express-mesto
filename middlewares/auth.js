const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'oneStrongSecret25');
  } catch (err) {
    res.status(401).send({message: 'Необходима авторизация'});
  }
  req.user = payload;

  next();
};
