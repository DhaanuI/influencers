const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    trim: true,
    default: ''
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: ['fashion', 'fitness', 'food', 'travel', 'tech', 'lifestyle', 'beauty', 'gaming', 'b2b', 'business', 'other'],
    default: 'other'
  },
  budget: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  totalApplications: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
advertisementSchema.index({ startupId: 1, status: 1 });
advertisementSchema.index({ category: 1, status: 1 });
advertisementSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Advertisement', advertisementSchema);

