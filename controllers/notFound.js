const notFound = (req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница не существует' });
};

module.exports = { notFound };
