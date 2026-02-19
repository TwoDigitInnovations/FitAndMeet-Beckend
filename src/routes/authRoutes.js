const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/update-player-id', authMiddleware, authController.updatePlayerID);
router.post('/test-notification', authMiddleware, authController.testNotification);

router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
