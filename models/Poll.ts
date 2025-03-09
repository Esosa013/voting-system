import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Option title is required'],
  },
  description: String,
  votes: {
    type: Number,
    default: 0,
  },
});

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Poll title is required'],
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  options: [optionSchema],
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  voters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
});

// Virtual for checking if poll is active
pollSchema.virtual('isActive').get(function() {
  return this.startDate <= new Date() && this.endDate >= new Date();
});

// Index for querying active polls
pollSchema.index({ endDate: 1, startDate: 1 });

export default mongoose.models.Poll || mongoose.model('Poll', pollSchema);