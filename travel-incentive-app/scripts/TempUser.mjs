import mongoose from 'mongoose';

const TempUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^.+@.+\..+$/, 'Please enter a valid email address']
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'super_admin', 'guide'],
    required: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  groupName: {
    type: String,
    default: 'Default Group'
  },
  birthDate: {
    type: Date,
    default: new Date('1990-01-01')
  },
  nationality: {
    type: String,
    default: 'IT'
  },
  preferences: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  }
});

const TempUser = mongoose.model('User', TempUserSchema);
export default TempUser;