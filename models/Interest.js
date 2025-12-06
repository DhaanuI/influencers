const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  influencerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Influencer',
    required: true
  },
  status: {
    type: String,
    enum: ['interested', 'contacted', 'rejected'],
    default: 'interested'
  },
  note: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate interests
interestSchema.index({ startupId: 1, influencerId: 1 }, { unique: true });

module.exports = mongoose.model('Interest', interestSchema);

