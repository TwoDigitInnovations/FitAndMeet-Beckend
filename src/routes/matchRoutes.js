const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/potential-matches', authMiddleware, matchController.getPotentialMatches);

router.get('/filtered-profiles', authMiddleware, matchController.getFilteredProfiles);

router.post('/like', authMiddleware, matchController.likeProfile);

router.delete('/unlike/:likedUserId', authMiddleware, matchController.unlikeProfile);

router.get('/liked-profiles', authMiddleware, matchController.getLikedProfiles);

module.exports = router;