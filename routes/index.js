const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');
const { notFound } = require('../controllers/notFound');

router.use(userRouter);
router.use(cardRouter);
router.use('/*', notFound);

module.exports = router;
