// Restituisce la registrazione dell'utente loggato
export const getUserRegistration = async (req, res) => {
  try {
    const mongoose = (await import('mongoose')).default;
    const eventId = new mongoose.Types.ObjectId(process.env.DEFAULT_EVENT_ID || '000000000000000000000000');
    const registration = await Registration.findOne({ userId: req.user.id, eventId });
    if (!registration) {
      return res.status(404).json({ message: 'Nessuna registrazione trovata' });
    }
    res.json(registration);
  } catch (err) {
    console.error('Errore getUserRegistration:', err);
    res.status(500).json({ message: 'Errore nel recupero della registrazione', error: err.message });
  }
};
import Trip from '../models/Trip.mjs';
import TravelInfo from '../models/TravelInfo.mjs';
import Registration from '../models/Registration.mjs';

// Get Trip Data
export const getTripData = async (req, res) => {
  try {
    const tripData = await Trip.findOne();
    res.json(tripData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Travel Info
export const getTravelInfo = async (req, res) => {
  try {
    const travelInfo = await TravelInfo.findOne();
    res.json(travelInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update Trip Data
export const updateTripData = async (req, res) => {
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
export const updateTravelInfo = async (req, res) => {
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
export const addAnnouncement = async (req, res) => {
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

// Submit registration
export const submitRegistration = async (req, res) => {
  try {
    const { outboundFlightId, returnFlightId, form_data, groupName } = req.body;

    // Log the request for debugging
    console.log('Registration request:', {
      userId: req.user.id,
      outboundFlightId,
      returnFlightId,
      groupName,
      form_data
    });

    // Aggiorna i dati dello user loggato
    const User = (await import('../models/User.mjs')).default;
    const userUpdate = {};
    if (form_data.firstName) userUpdate.firstName = form_data.firstName;
    if (form_data.lastName) userUpdate.lastName = form_data.lastName;
    if (form_data.email) userUpdate.email = form_data.email;
    if (form_data.mobilePhone) userUpdate.mobilePhone = form_data.mobilePhone;
    await User.findByIdAndUpdate(req.user.id, userUpdate, { new: true });

    // Cerca registrazione esistente
  const mongoose = (await import('mongoose')).default;
  const eventId = new mongoose.Types.ObjectId(process.env.DEFAULT_EVENT_ID || '000000000000000000000000');
  let registration = await Registration.findOne({ userId: req.user.id, eventId });
    if (registration) {
      // Aggiorna la registrazione esistente
      registration.outboundFlightId = outboundFlightId;
      registration.returnFlightId = returnFlightId;
      registration.groupName = groupName;
      registration.form_data = form_data;
      registration.status = 'pending';
      registration.submittedAt = new Date();
      await registration.save();
      res.json(registration);
    } else {
      // Crea nuova registrazione
      registration = new Registration({
        userId: req.user.id,
        outboundFlightId: outboundFlightId,
        returnFlightId: returnFlightId,
        groupName,
        form_data,
        status: 'pending',
        submittedAt: new Date(),
        eventId
      });
      // Validate registration before saving
      const validationError = registration.validateSync();
      if (validationError) {
        console.error('Validation error:', validationError);
        return res.status(400).json({
          message: 'Invalid registration data',
          errors: Object.keys(validationError.errors).reduce((acc, key) => {
            acc[key] = validationError.errors[key].message;
            return acc;
          }, {})
        });
      }
      const savedRegistration = await registration.save();
      res.json(savedRegistration);
    }

  } catch (err) {
    console.error('Registration error:', err);
    if (err instanceof Error) {
      console.error('Full error:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
        code: err.code,
        errors: err.errors
      });
    }
    res.status(500).json({
      message: 'Error saving registration',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      validation: err.errors ? Object.keys(err.errors).map(key => ({
        field: key,
        message: err.errors[key].message
      })) : undefined
    });
  }
};

// Delete Announcement
export const deleteAnnouncement = async (req, res) => {
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