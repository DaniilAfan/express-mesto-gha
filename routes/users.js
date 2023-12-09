const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAvatarById,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/me', updateUserById);
router.patch('/users/me/avatar', updateAvatarById);

module.exports = router;
