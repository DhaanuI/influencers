const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
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
  // For Startups
  companyName: {
    type: String,
    trim: true
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },
  profileViewsRemaining: {
    type: Number,
    default: 5 // Free plan gets 5 views
  },
  // For Influencers
  influencerProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Influencer'
  },
  applicationsRemaining: {
    type: Number,
    default: 5 // Free plan gets 5 applications per month
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

