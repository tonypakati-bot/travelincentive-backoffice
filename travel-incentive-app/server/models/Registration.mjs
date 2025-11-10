import mongoose from 'mongoose';

const formDataSchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  birthDate: { type: String, required: true, trim: true },
  nationality: { type: String, required: true, trim: true },
  mobilePhone: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  passportInRenewal: { type: Boolean, default: false },
  passportNumber: { type: String, required: true, trim: true },
  passportIssueDate: { type: String, required: true, trim: true },
  passportExpiryDate: { type: String, required: true, trim: true },
  foodRequirements: { type: String, trim: true },
  roomType: { type: String, required: true, trim: true },
  departureAirport: { type: String, required: true, trim: true },
  businessClass: { type: String, required: true, trim: true },
  // Fatturazione
  billingName: { type: String, required: true, trim: true },
  billingAddress: { type: String, required: true, trim: true },
  billingVat: { type: String, required: true, trim: true },
  billingSdi: { type: String, required: true, trim: true },
  // Consensi
  dataProcessingConsent: { type: String, required: true, trim: true },
  dataProcessingConsentCompanion: { type: String, trim: true },
  penaltiesAcknowledgement: { type: String, required: true, trim: true },
  // Accompagnatore
  hasCompanion: { type: Boolean, default: false },
  companionFirstName: { type: String, trim: true },
  companionLastName: { type: String, trim: true },
  companionBirthDate: { type: String, trim: true },
  companionNationality: { type: String, trim: true },
  companionPassportInRenewal: { type: Boolean, default: false },
  companionPassportNumber: { type: String, trim: true },
  companionPassportIssueDate: { type: String, trim: true },
  companionPassportExpiryDate: { type: String, trim: true },
  companionFoodRequirements: { type: String, trim: true },
  companionMeeting: { type: String, trim: true },
  dietaryRequirements: { type: String, trim: true }
}, { _id: false });

const registrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  outboundFlightId: {
    type: String, // Changed to String temporarily
    required: true
  },
  returnFlightId: {
    type: String, // Changed to String temporarily
    required: true
  },
  submittedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  groupName: {
    type: String,
    required: true,
    minlength: 1
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'waitlisted'],
    default: 'pending'
  },
  form_data: {
    type: formDataSchema,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Indici per ottimizzare le ricerche
// INDICE UNICO CRUCIALE: Assicura una sola registrazione per utente e per evento
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

// Ottimizzazione Lookup e ricerche frequenti
registrationSchema.index({ eventId: 1, submittedAt: -1 });
registrationSchema.index({ userId: 1 });
registrationSchema.index({ outboundFlightId: 1 });
registrationSchema.index({ returnFlightId: 1 });
registrationSchema.index({ groupName: 1 });
registrationSchema.index({ status: 1 });
registrationSchema.index({ 'form_data.companyName': 1 });

// Middleware pre-save
registrationSchema.pre('save', function(next) {
  if (this.isNew) {
    this.submittedAt = new Date();
  }
  next();
});

// Temporarily disabled flight validation
registrationSchema.pre('validate', async function(next) {
  next();
});

// Metodi di istanza
registrationSchema.methods.isConfirmed = function() {
  return this.status === 'confirmed';
};

registrationSchema.methods.cancel = async function(reason) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancellationDate = new Date();
  await this.save();
};

registrationSchema.methods.getFlightDetails = async function() {
  const outboundFlight = await this.model('Flight').findById(this.outboundFlightId);
  const returnFlight = await this.model('Flight').findById(this.returnFlightId);
  
  return {
    outbound: outboundFlight,
    return: returnFlight
  };
};

// Metodi statici
registrationSchema.statics.findByGroup = function(groupName) {
  return this.find({ groupName })
    .populate('userId', 'firstName lastName email')
    .populate('outboundFlightId returnFlightId');
};

registrationSchema.statics.getRegistrationStats = async function(eventId) {
  return this.aggregate([
    { $match: { eventId: mongoose.Types.ObjectId(eventId) } },
    { $group: {
      _id: '$status',
      count: { $sum: 1 },
      companies: { $addToSet: '$form_data.companyName' }
    }},
    { $project: {
      status: '$_id',
      count: 1,
      uniqueCompanies: { $size: '$companies' }
    }}
  ]);
};

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;