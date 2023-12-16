const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/unauthorizedError'); // 401

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'most-secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
