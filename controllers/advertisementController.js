const Advertisement = require('../models/Advertisement');
const Application = require('../models/Application');
const Influencer = require('../models/Influencer');

// @desc    Create new advertisement (Startup only)
// @route   POST /api/advertisements
exports.createAdvertisement = async (req, res) => {
  try {
    const { image, title, description, category, budget } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: 'Title and description are required'
      });
    }

    const advertisement = await Advertisement.create({
      startupId: req.user.id,
      image: image || '',
      title,
      description,
      category: category || 'other',
      budget: budget || '',
      status: 'active'
    });

    res.status(201).json({
      success: true,
      data: advertisement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all advertisements (for influencers to browse)
// @route   GET /api/advertisements
exports.getAllAdvertisements = async (req, res) => {
  try {
    const { category, status = 'active', page = 1, limit = 10 } = req.query;

    let query = { status };

    if (category && category !== 'all') {
      query.category = category;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Advertisement.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);

    const advertisements = await Advertisement.find(query)
      .populate('startupId', 'name companyName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: advertisements.length,
      totalCount,
      totalPages,
      currentPage: pageNum,
      data: advertisements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single advertisement by ID
// @route   GET /api/advertisements/:id
exports.getAdvertisementById = async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id)
      .populate('startupId', 'name companyName email');

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        error: 'Advertisement not found'
      });
    }

    res.json({
      success: true,
      data: advertisement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get my advertisements (Startup only)
// @route   GET /api/advertisements/my/posts
exports.getMyAdvertisements = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { startupId: req.user.id };

    if (status) {
      query.status = status;
    }

    const advertisements = await Advertisement.find(query)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: advertisements.length,
      data: advertisements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update advertisement (Startup only)
// @route   PUT /api/advertisements/:id
exports.updateAdvertisement = async (req, res) => {
  try {
    let advertisement = await Advertisement.findById(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        error: 'Advertisement not found'
      });
    }

    // Check ownership
    if (advertisement.startupId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this advertisement'
      });
    }

    advertisement = await Advertisement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: advertisement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete advertisement (Startup only)
// @route   DELETE /api/advertisements/:id
exports.deleteAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        error: 'Advertisement not found'
      });
    }

    // Check ownership
    if (advertisement.startupId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this advertisement'
      });
    }

    await Advertisement.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Advertisement deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Apply to advertisement (Influencer only)
// @route   POST /api/advertisements/:id/apply
exports.applyToAdvertisement = async (req, res) => {
  try {
    const advertisementId = req.params.id;
    const User = require('../models/User');

    // Check plan restrictions
    const user = await User.findById(req.user.id);
    if (user.applicationsRemaining <= 0) {
      return res.status(403).json({
        success: false,
        error: 'You have reached your application limit. Please upgrade your plan.'
      });
    }

    // Check if advertisement exists
    const advertisement = await Advertisement.findById(advertisementId);
    if (!advertisement) {
      return res.status(404).json({
        success: false,
        error: 'Advertisement not found'
      });
    }

    if (advertisement.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'This advertisement is no longer active'
      });
    }

    // Get influencer profile
    const influencer = await Influencer.findOne({ userId: req.user.id });
    if (!influencer) {
      return res.status(404).json({
        success: false,
        error: 'Please create your influencer profile first'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      advertisementId,
      influencerId: influencer._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        error: 'You have already applied to this advertisement'
      });
    }

    // Create application
    const application = await Application.create({
      advertisementId,
      influencerId: influencer._id,
      userId: req.user.id,
      status: 'pending'
    });

    // Increment total applications and decrement user's remaining applications
    await Advertisement.findByIdAndUpdate(advertisementId, {
      $inc: { totalApplications: 1 }
    });

    await User.findByIdAndUpdate(req.user.id, {
      $inc: { applicationsRemaining: -1 }
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
      applicationsRemaining: user.applicationsRemaining - 1
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get applications for an advertisement (Startup only)
// @route   GET /api/advertisements/:id/applications
exports.getAdvertisementApplications = async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        error: 'Advertisement not found'
      });
    }

    // Check ownership
    if (advertisement.startupId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view these applications'
      });
    }

    const applications = await Application.find({ advertisementId: req.params.id })
      .populate('influencerId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get my applications (Influencer only)
// @route   GET /api/advertisements/my/applications
exports.getMyApplications = async (req, res) => {
  try {
    const influencer = await Influencer.findOne({ userId: req.user.id });

    if (!influencer) {
      return res.status(404).json({
        success: false,
        error: 'Influencer profile not found'
      });
    }

    const applications = await Application.find({ influencerId: influencer._id })
      .populate('advertisementId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update application status (Startup only)
// @route   PUT /api/advertisements/applications/:applicationId
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.applicationId)
      .populate('advertisementId');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Check if user owns the advertisement
    if (application.advertisementId.startupId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this application'
      });
    }

    application.status = status || application.status;
    await application.save();

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

