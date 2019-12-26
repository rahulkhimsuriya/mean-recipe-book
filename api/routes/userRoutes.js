const express = require('express');
const router = express.Router();

// Controllers
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch('/updateMe', authController.protect, userController.updateMe);

router.patch(
  '/updateMyPassword',
  authController.protect,
  userController.updateMyPassword
);

router
  .route('/')
  .get(authController.protect, userController.getAllUser)
  .post(userController.createNewUser);

router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  // .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser);

module.exports = router;
