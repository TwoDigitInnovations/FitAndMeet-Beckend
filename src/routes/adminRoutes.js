const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/users', authMiddleware, adminController.getAllUsers);
router.put('/users/:userId/soft-delete', authMiddleware, adminController.softDeleteUser);
router.get('/users/deleted', authMiddleware, adminController.getDeletedUsers);
router.put('/users/:userId/restore', authMiddleware, adminController.restoreUser);
router.delete('/users/:userId/permanent', authMiddleware, adminController.permanentDeleteUser);

module.exports = router;
