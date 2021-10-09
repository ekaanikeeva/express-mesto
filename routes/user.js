const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  editProfile,
  editAvatar,
} = require('../controllers/user');

router.get('/users', getUsers);
router.get('/users/:_id', getUserById);
router.post('/users', createUser);
router.patch('/users/me', editProfile);
router.patch('/users/me/avatar', editAvatar);

module.exports = router;
