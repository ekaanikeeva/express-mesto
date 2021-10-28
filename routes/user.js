const router = require('express').Router();
const {
  getUsers,
  getUserById,
  editProfile,
  editAvatar,
  getCurrentUser,
} = require('../controllers/user');

router.get('/users/me', getCurrentUser);
router.get('/users', getUsers);
router.get('/users/:_id', getUserById);
router.patch('/users/me', editProfile);
router.patch('/users/me/avatar', editAvatar);

module.exports = router;
