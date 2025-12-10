const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  advertisementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Advertisement',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate applications
applicationSchema.index({ advertisementId: 1, userId: 1 }, { unique: true });
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ advertisementId: 1, status: 1 });

module.exports = mongoose.model('Application', applicationSchema);

