const router = require('express').Router();
const {
  getUsers, getUser, createUser, editProfile, editAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUser);

router.post('/', createUser);

router.patch('/users/me', editProfile);

router.patch('/users/me/avatar', editAvatar);

module.exports = router;
