import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  direction: {
    type: String,
    enum: ['outbound', 'return'],
    required: true
  },
  airline: {
    type: String,
    required: true
  },
  flightNumber: {
    type: String,
    required: true
  },
  departureGroup: {
    type: String,
    required: true
  },
  departure: {
    airport: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  },
  arrival: {
    airport: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  },
  duration: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Flight', flightSchema);