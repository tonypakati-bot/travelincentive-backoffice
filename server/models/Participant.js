import mongoose from 'mongoose';

const ParticipantSchema = new mongoose.Schema({
  name: String,
  email: String,
  trip: String,
  group: String,
  status: { type: String, default: 'To Invite' }
});

export default mongoose.model('Participant', ParticipantSchema);
