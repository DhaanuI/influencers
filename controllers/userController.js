const User = require('../models/User');

// @desc    Get all influencers with their embeds (for startups to browse)
// @route   GET /api/users/influencers
exports.getAllInfluencers = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    let query = { userType: 'influencer' };

    if (category && category !== 'all') {
      query.category = category;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);

    const influencers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
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

// @desc    Update influencer profile and embeds
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      bio,
      followersCount,
      category,
      instagramUsername,
      instagramProfileUrl,
      instagramEmbedLinks,
      linkedinProfileUrl,
      linkedinEmbedLinks,
      youtubeChannelUrl,
      youtubeEmbedLinks
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update fields
    if (bio !== undefined) user.bio = bio;
    if (followersCount !== undefined) user.followersCount = followersCount;
    if (category !== undefined) user.category = category;
    if (instagramUsername !== undefined) user.instagramUsername = instagramUsername;
    if (instagramProfileUrl !== undefined) user.instagramProfileUrl = instagramProfileUrl;
    if (instagramEmbedLinks !== undefined) user.instagramEmbedLinks = instagramEmbedLinks;
    if (linkedinProfileUrl !== undefined) user.linkedinProfileUrl = linkedinProfileUrl;
    if (linkedinEmbedLinks !== undefined) user.linkedinEmbedLinks = linkedinEmbedLinks;
    if (youtubeChannelUrl !== undefined) user.youtubeChannelUrl = youtubeChannelUrl;
    if (youtubeEmbedLinks !== undefined) user.youtubeEmbedLinks = youtubeEmbedLinks;

    await user.save();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Add embed link (Instagram or LinkedIn)
// @route   POST /api/users/embeds
exports.addEmbed = async (req, res) => {
  try {
    const { platform, embedLink } = req.body;

    if (!platform || !embedLink) {
      return res.status(400).json({
        success: false,
        error: 'Platform and embed link are required'
      });
    }

    const user = await User.findById(req.user.id);

    if (platform === 'instagram') {
      if (user.instagramEmbedLinks.length >= 10) {
        return res.status(400).json({
          success: false,
          error: 'Maximum 10 Instagram embeds allowed'
        });
      }
      user.instagramEmbedLinks.push(embedLink);
    } else if (platform === 'linkedin') {
      if (user.linkedinEmbedLinks.length >= 10) {
        return res.status(400).json({
          success: false,
          error: 'Maximum 10 LinkedIn embeds allowed'
        });
      }
      user.linkedinEmbedLinks.push(embedLink);
    } else if (platform === 'youtube') {
      if (user.youtubeEmbedLinks.length >= 10) {
        return res.status(400).json({
          success: false,
          error: 'Maximum 10 YouTube embeds allowed'
        });
      }
      user.youtubeEmbedLinks.push(embedLink);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid platform. Use "instagram", "linkedin", or "youtube"'
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Embed added successfully',
      data: {
        instagramEmbedLinks: user.instagramEmbedLinks,
        linkedinEmbedLinks: user.linkedinEmbedLinks,
        youtubeEmbedLinks: user.youtubeEmbedLinks
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

