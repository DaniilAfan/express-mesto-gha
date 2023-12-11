const { NOT_FOUND_ERROR_CODE } = require('../utils/constants');

const notFound = (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемая страница не существует' });
};

module.exports = { notFound };
