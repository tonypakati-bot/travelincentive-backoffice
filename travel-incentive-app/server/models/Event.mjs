import mongoose from 'mongoose';

const agendaItemSchema = new mongoose.Schema({
  id: Number,
  category: String,
  icon: String,
  time: String,
  title: String,
  description: String,
  longDescription: String,
  image: {
    urls: [String],
    caption: String,
    details: [{
      icon: String,
      text: String
    }]
  }
});

const agendaDaySchema = new mongoose.Schema({
  day: Number,
  title: String,
  date: String,
  items: [agendaItemSchema]
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: String,
  brandImageUrl: String,
  backgroundImageUrl: String,
  registrationDeadline: Date,
  agenda: [agendaDaySchema]
}, {
  timestamps: true
});

export default mongoose.model('Event', eventSchema);