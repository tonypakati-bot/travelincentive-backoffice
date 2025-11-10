const Trip = require('../models/Trip');
const TravelInfo = require('../models/TravelInfo');

// Get Trip Data
exports.getTripData = async (req, res) => {
  try {
    const tripData = await Trip.findOne();
    res.json(tripData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Travel Info
exports.getTravelInfo = async (req, res) => {
  try {
    const travelInfo = await TravelInfo.findOne();
    res.json(travelInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update Trip Data
exports.updateTripData = async (req, res) => {
  try {
    const tripData = await Trip.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true
    });
    res.json(tripData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update Travel Info
exports.updateTravelInfo = async (req, res) => {
  try {
    const travelInfo = await TravelInfo.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true
    });
    res.json(travelInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add Announcement
exports.addAnnouncement = async (req, res) => {
  try {
    const trip = await Trip.findOne();
    trip.announcements.unshift(req.body);
    await trip.save();
    res.json(trip.announcements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete Announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const trip = await Trip.findOne();
    trip.announcements = trip.announcements.filter(
      ann => ann.id.toString() !== req.params.id
    );
    await trip.save();
    res.json(trip.announcements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};