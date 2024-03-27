const { getDashboardData, getDashboardDataForAdmin } = require('../Controllers/productControllers');
const userController = require('../Controllers/userController');
const express = require('express');
const { authenticateUser } = require('../middlewares/authentication');
const router = express.Router()

router.post('/user/register', userController.register);
router.post('/user/login', userController.login);
router.get('/user/view/:id', userController.getSingleUser);
router.get('/user/view', userController.getAllUsers);
router.delete('/user/:id', userController.removeUser);
router.put('/user/:id', userController.updateUser);
router.post('/user/forgetPassword', userController.forgetPasword);
router.post('/user/verifyOtp', userController.verifyOtp);
router.get('/user/analytics',authenticateUser,getDashboardData)
router.get('/user/analytics/admin',getDashboardDataForAdmin)


module.exports = router

































