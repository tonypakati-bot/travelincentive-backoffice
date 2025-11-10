import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  flightId: {
    type: String,
    required: true,
    index: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  documentType: {
    type: String,
    enum: ['boarding_pass', 'insurance', 'visa', 'itinerary', 'general'],
    default: 'boarding_pass'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indice composto per prestazioni migliori
documentSchema.index({ userId: 1, flightId: 1, uploadedAt: -1 });

export default mongoose.model('Document', documentSchema);