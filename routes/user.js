const router = require('express').Router();
const {
  getUsers,
  getUserById,
  editProfile,
  editAvatar,
  getCurrentUser,
} = require('../controllers/user');

const { validateUser, validateAvatar, validateId } = require('../middlewares/validate');

router.get('/users/me', getCurrentUser);
router.get('/users', getUsers);
router.get('/users/:_id', validateId, getUserById);
router.patch('/users/me', validateUser, editProfile);
router.patch('/users/me/avatar', validateAvatar, editAvatar);

module.exports = router;
