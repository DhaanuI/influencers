const express = require('express');
const router = express.Router();
const {
  getAllInfluencers,
  updateProfile,
  addEmbed
} = require('../controllers/userController');
const { protect, isInfluencer, isStartup } = require('../middleware/auth');

// Startup routes - view influencers and their content
router.get('/influencers', protect, isStartup, getAllInfluencers);

// Influencer routes - manage profile and embeds
router.put('/profile', protect, isInfluencer, updateProfile);
router.post('/embeds', protect, isInfluencer, addEmbed);

module.exports = router;

