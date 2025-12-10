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
  }
}, {
  timestamps: true
});



module.exports = mongoose.model('Influencer', influencerSchema);

