import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userImageUrl: String,
  caption: String,
  day: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Photo', photoSchema);