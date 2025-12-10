const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  userType: {
    type: String,
    enum: ['startup', 'influencer'],
    required: [true, 'User type is required']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },

  // Startup fields
  companyName: {
    type: String,
    trim: true
  },
  profileViewsRemaining: {
    type: Number,
    default: 5
  },

  // Influencer fields
  bio: {
    type: String,
    default: ''
  },
  followersCount: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['fashion', 'fitness', 'food', 'travel', 'tech', 'lifestyle', 'beauty', 'gaming', 'b2b', 'business', 'other'],
    default: 'other'
  },
  instagramUsername: {
    type: String,
    trim: true
  },
  instagramProfileUrl: {
    type: String,
    trim: true
  },
  instagramEmbedLinks: [{
    type: String,
    trim: true
  }],
  linkedinProfileUrl: {
    type: String,
    trim: true
  },
  linkedinEmbedLinks: [{
    type: String,
    trim: true
  }],
  applicationsRemaining: {
    type: Number,
    default: 5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

