const flightData = [
  {
    _id: 'fl_mxp_out',
    direction: 'outbound',
    airline: 'Etihad Airways',
    flightNumber: 'EY074',
    departureGroup: 'MXP',
    departure: {
      airport: 'Milano Malpensa',
      code: 'MXP',
      time: '09:25',
      date: new Date('2025-11-06')
    },
    arrival: {
      airport: 'Abu Dhabi International',
      code: 'AUH',
      time: '18:45',
      date: new Date('2025-11-06')
    },
    duration: '6h 20m'
  },
  {
    _id: 'fl_mxp_ret',
    direction: 'return',
    airline: 'Etihad Airways',
    flightNumber: 'EY073',
    departureGroup: 'MXP',
    departure: {
      airport: 'Abu Dhabi International',
      code: 'AUH',
      time: '02:55',
      date: new Date('2025-11-10')
    },
    arrival: {
      airport: 'Milano Malpensa',
      code: 'MXP',
      time: '06:45',
      date: new Date('2025-11-10')
    },
    duration: '6h 50m'
  }
];

module.exports = flightData;