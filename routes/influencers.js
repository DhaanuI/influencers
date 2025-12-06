const express = require('express');
const router = express.Router();
const {
  getAllInfluencers,
  getInfluencerById,
  getInfluencerEmbeds,
  createOrUpdateProfile,
  updateEmbedLinks,
  getMyProfile,
  viewInfluencerProfile,
  markInterest,
  getMyInterests,
  getProfileInterests
} = require('../controllers/influencerController');
const { protect, isInfluencer, isStartup } = require('../middleware/auth');

// Browse influencers (authenticated users)
router.get('/', protect, getAllInfluencers);
router.get('/:id', protect, getInfluencerById);
router.get('/:id/embeds', protect, getInfluencerEmbeds);

// Influencer-only routes
router.post('/profile', protect, isInfluencer, createOrUpdateProfile);
router.put('/embed-links', protect, isInfluencer, updateEmbedLinks);
router.get('/me/profile', protect, isInfluencer, getMyProfile);
router.get('/me/interests', protect, isInfluencer, getProfileInterests);

// Startup routes
router.get('/view/:id', protect, isStartup, viewInfluencerProfile);
router.post('/interest/:influencerId', protect, isStartup, markInterest);
router.get('/my/interests', protect, isStartup, getMyInterests);

module.exports = router;

