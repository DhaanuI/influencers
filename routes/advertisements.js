const express = require('express');
const router = express.Router();
const {
  createAdvertisement,
  getAllAdvertisements,
  getAdvertisementById,
  getMyAdvertisements,
  updateAdvertisement,
  deleteAdvertisement,
  applyToAdvertisement,
  getAdvertisementApplications,
  getMyApplications,
  updateApplicationStatus
} = require('../controllers/advertisementController');
const { protect, isInfluencer, isStartup } = require('../middleware/auth');

// Public/Authenticated routes
router.get('/', protect, getAllAdvertisements);

// Startup-only routes (specific routes before :id)
router.post('/', protect, isStartup, createAdvertisement);
router.get('/my/posts', protect, isStartup, getMyAdvertisements);
router.put('/applications/:applicationId', protect, isStartup, updateApplicationStatus);

// Influencer-only routes (specific routes before :id)
router.get('/my/applications', protect, isInfluencer, getMyApplications);

// Routes with :id parameter (must come after specific routes)
router.get('/:id', protect, getAdvertisementById);
router.put('/:id', protect, isStartup, updateAdvertisement);
router.delete('/:id', protect, isStartup, deleteAdvertisement);
router.get('/:id/applications', protect, isStartup, getAdvertisementApplications);
router.post('/:id/apply', protect, isInfluencer, applyToAdvertisement);

module.exports = router;

