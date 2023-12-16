const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUserById,
  updateAvatarById,
  getCurrentUser,
} = require('../controllers/users');

const {
  validateGetUserById,
  validateUpdateUserById,
  validateUpdateAvatarById,
} = require('../middlewares/requestValidation');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:id', validateGetUserById, getUserById);
router.patch('/users/me', validateUpdateUserById, updateUserById);
router.patch('/users/me/avatar', validateUpdateAvatarById, updateAvatarById);

module.exports = router;
