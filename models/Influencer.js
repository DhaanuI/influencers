const mongoose = require('mongoose');

const influencerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true
  },

  // Instagram Info
  instagramUsername: {
    type: String,
    trim: true,
    sparse: true  // Allow null but unique if provided
  },
  instagramProfileUrl: {
    type: String,
    trim: true
  },
  instagramEmbedLinks: [{
    type: String,
    trim: true
  }],

  // LinkedIn Info
  linkedinProfileUrl: {
    type: String,
    trim: true
  },
  linkedinEmbedLinks: [{
    type: String,
    trim: true
  }],

  // Profile Details
  bio: {
    type: String,
    default: ''
  },
  followersCount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['fashion', 'fitness', 'food', 'travel', 'tech', 'lifestyle', 'beauty', 'gaming', 'b2b', 'business', 'other'],
    default: 'other'
  },

  // Platform preferences
  platforms: [{
    type: String,
    enum: ['instagram', 'linkedin'],
    default: []
  }],

  // Status
  isProfileComplete: {
    type: Boolean,
    default: false
  },

  // Stats
  totalInterests: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for total embeds across all platforms
influencerSchema.virtual('totalEmbeds').get(function() {
  return (this.instagramEmbedLinks?.length || 0) + (this.linkedinEmbedLinks?.length || 0);
});

// Method to check if profile is complete
influencerSchema.methods.checkProfileComplete = function() {
  const hasInstagram = this.instagramUsername && this.instagramEmbedLinks?.length > 0;
  const hasLinkedIn = this.linkedinProfileUrl && this.linkedinEmbedLinks?.length > 0;
  return hasInstagram || hasLinkedIn;
};

module.exports = mongoose.model('Influencer', influencerSchema);

