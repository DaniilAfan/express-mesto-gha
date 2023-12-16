const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const signupRouter = require('./signup');
const signinRouter = require('./signin');
const { notFound } = require('../controllers/notFound');

router.use(signupRouter);
router.use(signinRouter);
router.use(auth);
router.use(userRouter);
router.use(cardRouter);
router.use('/*', notFound);

module.exports = router;
