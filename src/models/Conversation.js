const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure only 2 participants per conversation
conversationSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    return next(new Error('Conversation must have exactly 2 participants'));
  }
  // Sort participants to ensure consistent ordering for uniqueness
  this.participants.sort();
  next();
});

// Remove the old index and use a virtual field approach
// No index here - we'll handle uniqueness in the application logic

module.exports = mongoose.model('Conversation', conversationSchema);