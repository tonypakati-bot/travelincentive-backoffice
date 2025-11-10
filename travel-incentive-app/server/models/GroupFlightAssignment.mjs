const mongoose = require('mongoose');

const groupFlightAssignmentSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  groupName: {
    type: String,
    required: true,
    trim: true
  },
  departureAirportCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[A-Z]{3}$/.test(v);
      },
      message: props => `${props.value} is not a valid IATA airport code!`
    }
  },
  outboundFlightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  returnFlightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'full'],
    default: 'active'
  },
  capacity: {
    max: {
      type: Number,
      min: 1
    },
    current: {
      type: Number,
      default: 0,
      validate: {
        validator: function(v) {
          return v <= this.capacity.max;
        },
        message: 'Current capacity cannot exceed maximum capacity'
      }
    }
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
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
// INDICE UNICO CRUCIALE: Previene regole di assegnazione in conflitto
groupFlightAssignmentSchema.index(
  { 
    eventId: 1, 
    groupName: 1, 
    departureAirportCode: 1 
  }, 
  { unique: true }
);

// Ricerca standard per l'assegnazione
groupFlightAssignmentSchema.index({ eventId: 1, groupName: 1 });

// Indici di supporto per le relazioni
groupFlightAssignmentSchema.index({ outboundFlightId: 1 });
groupFlightAssignmentSchema.index({ returnFlightId: 1 });
groupFlightAssignmentSchema.index({ eventId: 1, status: 1 });

// Middleware pre-validate
groupFlightAssignmentSchema.pre('validate', async function(next) {
  try {
    // Verifica che i voli esistano e appartengano all'evento corretto
    const [outbound, return_] = await Promise.all([
      this.model('Flight').findById(this.outboundFlightId),
      this.model('Flight').findById(this.returnFlightId)
    ]);

    if (!outbound || !return_) {
      throw new Error('Referenced flights not found');
    }

    // Verifica che i voli appartengano all'evento corretto
    if (outbound.eventId.toString() !== this.eventId.toString() ||
        return_.eventId.toString() !== this.eventId.toString()) {
      throw new Error('Flights must belong to the specified event');
    }

    // Verifica che i voli abbiano la direzione corretta
    if (outbound.direction !== 'outbound' || return_.direction !== 'return') {
      throw new Error('Invalid flight direction assignment');
    }

    // Verifica che l'aeroporto di partenza corrisponda
    if (outbound.segments[0].departure.airportCode !== this.departureAirportCode) {
      throw new Error('Outbound flight departure airport does not match');
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Metodi di istanza
groupFlightAssignmentSchema.methods.isAvailable = function() {
  return this.status === 'active' && 
         (!this.capacity.max || this.capacity.current < this.capacity.max);
};

groupFlightAssignmentSchema.methods.incrementCapacity = async function() {
  if (!this.isAvailable()) {
    throw new Error('Group flight assignment is not available');
  }

  this.capacity.current += 1;
  if (this.capacity.max && this.capacity.current >= this.capacity.max) {
    this.status = 'full';
  }

  await this.save();
};

groupFlightAssignmentSchema.methods.decrementCapacity = async function() {
  if (this.capacity.current > 0) {
    this.capacity.current -= 1;
    if (this.status === 'full') {
      this.status = 'active';
    }
    await this.save();
  }
};

// Metodi statici
groupFlightAssignmentSchema.statics.findAvailableForEvent = function(eventId) {
  return this.find({
    eventId,
    status: 'active',
    $or: [
      { 'capacity.max': { $exists: false } },
      { $expr: { $lt: ['$capacity.current', '$capacity.max'] } }
    ]
  }).sort({ priority: -1 });
};

groupFlightAssignmentSchema.statics.findByDepartureAirport = function(eventId, airportCode) {
  return this.find({
    eventId,
    departureAirportCode: airportCode.toUpperCase(),
    status: { $ne: 'inactive' }
  }).populate('outboundFlightId returnFlightId');
};

module.exports = mongoose.model('GroupFlightAssignment', groupFlightAssignmentSchema);