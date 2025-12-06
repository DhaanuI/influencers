const Influencer = require('../models/Influencer');
const User = require('../models/User');
const Interest = require('../models/Interest');

// Get all influencers (for startups to browse) with pagination
exports.getAllInfluencers = async (req, res) => {
  try {
    const { category, minFollowers, maxFollowers, page = 1, limit = 10 } = req.query;

    let query = { isProfileComplete: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (minFollowers) {
      query.followersCount = { ...query.followersCount, $gte: parseInt(minFollowers) };
    }

    if (maxFollowers) {
      query.followersCount = { ...query.followersCount, $lte: parseInt(maxFollowers) };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination info
    const totalCount = await Influencer.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);

    const influencers = await Influencer.find(query)
      .populate('userId', 'name email')
      .sort({ followersCount: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: influencers.length,
      totalCount,
      totalPages,
      currentPage: pageNum,
      data: influencers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single influencer by ID
exports.getInfluencerById = async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id);

    if (!influencer) {
      return res.status(404).json({
        success: false,
        error: 'Influencer not found'
      });
    }

    res.json({
      success: true,
      data: influencer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single influencer's embed posts only
exports.getInfluencerEmbeds = async (req, res) => {
  try {
    const { platform } = req.query; // Optional: filter by platform

    const influencer = await Influencer.findById(req.params.id)
      .select('name instagramUsername instagramProfileUrl linkedinProfileUrl instagramEmbedLinks linkedinEmbedLinks followersCount category platforms');

    if (!influencer) {
      return res.status(404).json({
        success: false,
        error: 'Influencer not found'
      });
    }

    const responseData = {
      influencerId: influencer._id,
      name: influencer.name,
      followersCount: influencer.followersCount,
      category: influencer.category,
      platforms: influencer.platforms || []
    };

    // If platform filter is specified
    if (platform === 'instagram') {
      responseData.instagram = {
        username: influencer.instagramUsername,
        profileUrl: influencer.instagramProfileUrl,
        embedLinks: influencer.instagramEmbedLinks || [],
        totalEmbeds: influencer.instagramEmbedLinks?.length || 0
      };
    } else if (platform === 'linkedin') {
      responseData.linkedin = {
        profileUrl: influencer.linkedinProfileUrl,
        embedLinks: influencer.linkedinEmbedLinks || [],
        totalEmbeds: influencer.linkedinEmbedLinks?.length || 0
      };
    } else {
      // Return both platforms
      responseData.instagram = {
        username: influencer.instagramUsername,
        profileUrl: influencer.instagramProfileUrl,
        embedLinks: influencer.instagramEmbedLinks || [],
        totalEmbeds: influencer.instagramEmbedLinks?.length || 0
      };
      responseData.linkedin = {
        profileUrl: influencer.linkedinProfileUrl,
        embedLinks: influencer.linkedinEmbedLinks || [],
        totalEmbeds: influencer.linkedinEmbedLinks?.length || 0
      };
      responseData.totalEmbeds = (influencer.instagramEmbedLinks?.length || 0) + (influencer.linkedinEmbedLinks?.length || 0);
    }

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create or update influencer profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const {
      name,
      instagramUsername,
      linkedinProfileUrl,
      bio,
      followersCount,
      category,
      instagramEmbedLinks,
      linkedinEmbedLinks,
      platforms
    } = req.body;

    // Validation
    if (!name || !followersCount) {
      return res.status(400).json({
        success: false,
        error: 'Name and followers count are required'
      });
    }

    // At least one platform must be provided
    if (!instagramUsername && !linkedinProfileUrl) {
      return res.status(400).json({
        success: false,
        error: 'At least one platform (Instagram or LinkedIn) is required'
      });
    }

    // Check if influencer profile already exists for this user
    let influencer = await Influencer.findOne({ userId: req.user.id });

    const updateData = {
      name,
      bio: bio || '',
      followersCount,
      category: category || 'other',
      platforms: platforms || [],
      lastUpdated: Date.now()
    };

    // Instagram data
    if (instagramUsername) {
      updateData.instagramUsername = instagramUsername;
      updateData.instagramProfileUrl = `https://instagram.com/${instagramUsername}`;
      if (instagramEmbedLinks && Array.isArray(instagramEmbedLinks)) {
        updateData.instagramEmbedLinks = instagramEmbedLinks.slice(0, 3); // Max 3
      }
    }

    // LinkedIn data
    if (linkedinProfileUrl) {
      updateData.linkedinProfileUrl = linkedinProfileUrl;
      if (linkedinEmbedLinks && Array.isArray(linkedinEmbedLinks)) {
        updateData.linkedinEmbedLinks = linkedinEmbedLinks.slice(0, 3); // Max 3
      }
    }

    if (influencer) {
      // Update existing profile
      Object.assign(influencer, updateData);

      // Check if profile is complete
      const hasInstagram = influencer.instagramUsername && influencer.instagramEmbedLinks?.length > 0;
      const hasLinkedIn = influencer.linkedinProfileUrl && influencer.linkedinEmbedLinks?.length > 0;
      influencer.isProfileComplete = hasInstagram || hasLinkedIn;

      await influencer.save();
    } else {
      // Create new profile
      influencer = await Influencer.create({
        userId: req.user.id,
        ...updateData,
        instagramEmbedLinks: updateData.instagramEmbedLinks || [],
        linkedinEmbedLinks: updateData.linkedinEmbedLinks || [],
        isProfileComplete: false
      });

      // Check if profile is complete
      const hasInstagram = influencer.instagramUsername && influencer.instagramEmbedLinks?.length > 0;
      const hasLinkedIn = influencer.linkedinProfileUrl && influencer.linkedinEmbedLinks?.length > 0;
      influencer.isProfileComplete = hasInstagram || hasLinkedIn;

      await influencer.save();

      // Update user's influencerProfile reference
      await User.findByIdAndUpdate(req.user.id, {
        influencerProfile: influencer._id
      });
    }

    res.status(201).json({
      success: true,
      data: influencer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Add/Update embed links (Instagram or LinkedIn)
exports.updateEmbedLinks = async (req, res) => {
  try {
    const { platform, embedLinks } = req.body;

    // Validation
    if (!platform || !['instagram', 'linkedin'].includes(platform)) {
      return res.status(400).json({
        success: false,
        error: 'Platform must be either "instagram" or "linkedin"'
      });
    }

    if (!embedLinks || !Array.isArray(embedLinks) || embedLinks.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of embed URLs'
      });
    }

    if (embedLinks.length > 3) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 3 embed links allowed per platform'
      });
    }

    // Get influencer profile
    let influencer = await Influencer.findOne({ userId: req.user.id });

    if (!influencer) {
      return res.status(404).json({
        success: false,
        error: 'Please create your influencer profile first'
      });
    }

    // Update embed links based on platform
    if (platform === 'instagram') {
      influencer.instagramEmbedLinks = embedLinks;
      if (!influencer.platforms.includes('instagram')) {
        influencer.platforms.push('instagram');
      }
    } else if (platform === 'linkedin') {
      influencer.linkedinEmbedLinks = embedLinks;
      if (!influencer.platforms.includes('linkedin')) {
        influencer.platforms.push('linkedin');
      }
    }

    // Check if profile is complete
    const hasInstagram = influencer.instagramUsername && influencer.instagramEmbedLinks?.length > 0;
    const hasLinkedIn = influencer.linkedinProfileUrl && influencer.linkedinEmbedLinks?.length > 0;
    influencer.isProfileComplete = hasInstagram || hasLinkedIn;

    influencer.lastUpdated = Date.now();
    await influencer.save();

    res.json({
      success: true,
      data: influencer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get my influencer profile
exports.getMyProfile = async (req, res) => {
  try {
    const influencer = await Influencer.findOne({ userId: req.user.id });

    if (!influencer) {
      return res.status(404).json({
        success: false,
        error: 'Influencer profile not found'
      });
    }

    res.json({
      success: true,
      data: influencer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// View influencer profile (for startups - decrements view count)
exports.viewInfluencerProfile = async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id)
      .populate('userId', 'name email');

    if (!influencer) {
      return res.status(404).json({
        success: false,
        error: 'Influencer not found'
      });
    }

    // Check if startup has views remaining
    if (req.user.userType === 'startup') {
      if (req.user.profileViewsRemaining <= 0) {
        return res.status(403).json({
          success: false,
          error: 'No profile views remaining. Please upgrade your plan.'
        });
      }

      // Decrement view count for startup
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { profileViewsRemaining: -1 }
      });

      // Increment total views for influencer
      await Influencer.findByIdAndUpdate(req.params.id, {
        $inc: { totalViews: 1 }
      });
    }

    res.json({
      success: true,
      data: {
        _id: influencer._id,
        name: influencer.name,
        bio: influencer.bio,
        followersCount: influencer.followersCount,
        category: influencer.category,
        platforms: influencer.platforms || [],
        instagram: {
          username: influencer.instagramUsername,
          profileUrl: influencer.instagramProfileUrl,
          embedLinks: influencer.instagramEmbedLinks || []
        },
        linkedin: {
          profileUrl: influencer.linkedinProfileUrl,
          embedLinks: influencer.linkedinEmbedLinks || []
        },
        totalInterests: influencer.totalInterests,
        totalViews: influencer.totalViews + 1
      },
      viewsRemaining: req.user.userType === 'startup' ? req.user.profileViewsRemaining - 1 : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Mark interest in influencer (Startup clicks "Interested")
exports.markInterest = async (req, res) => {
  try {
    const { influencerId } = req.params;
    const { note } = req.body;

    // Check if influencer exists
    const influencer = await Influencer.findById(influencerId);
    if (!influencer) {
      return res.status(404).json({
        success: false,
        error: 'Influencer not found'
      });
    }

    // Check if already interested
    let interest = await Interest.findOne({
      startupId: req.user.id,
      influencerId
    });

    if (interest) {
      return res.status(400).json({
        success: false,
        error: 'You have already marked interest in this influencer'
      });
    }

    // Create interest
    interest = await Interest.create({
      startupId: req.user.id,
      influencerId,
      note: note || '',
      status: 'interested'
    });

    // Increment total interests for influencer
    await Influencer.findByIdAndUpdate(influencerId, {
      $inc: { totalInterests: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Interest marked successfully',
      data: interest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get my interests (for startups)
exports.getMyInterests = async (req, res) => {
  try {
    const interests = await Interest.find({ startupId: req.user.id })
      .populate('influencerId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: interests.length,
      data: interests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get interests in my profile (for influencers)
exports.getProfileInterests = async (req, res) => {
  try {
    const influencer = await Influencer.findOne({ userId: req.user.id });

    if (!influencer) {
      return res.status(404).json({
        success: false,
        error: 'Influencer profile not found'
      });
    }

    const interests = await Interest.find({ influencerId: influencer._id })
      .populate('startupId', 'name email companyName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: interests.length,
      data: interests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

