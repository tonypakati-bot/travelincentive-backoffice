import mongoose from 'mongoose';
import Photo from '../models/Photo.mjs';
import Registration from '../models/Registration.mjs';

// Get available documents
export const getDocuments = async (req, res) => {
  try {
    // TODO: Implementare la logica per recuperare i documenti disponibili
    const documents = [
      'programma_dettagliato.pdf',
      'informativa_viaggio.pdf',
      'assicurazione_documenti.pdf'
    ];
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Submit registration
export const submitRegistration = async (req, res) => {
  try {
    const registration = new Registration({
      userId: req.user.id,
      ...req.body
    });
    
    // Validate required fields
    if (!req.body.outboundFlightId) throw new Error('outboundFlightId is required');
    if (!req.body.returnFlightId) throw new Error('returnFlightId is required');
    if (!req.body.form_data) throw new Error('form_data is required');
    
    // Additional validation for nested form_data
    const { form_data } = req.body;
    if (!form_data.companyName) throw new Error('form_data.companyName is required');
    if (!form_data.mobilePhone) throw new Error('form_data.mobilePhone is required');
    if (!form_data.billing) throw new Error('form_data.billing is required');
    if (!form_data.consents) throw new Error('form_data.consents is required');
    
    // Save registration
    await registration.save();
    
    // Return success response
    res.json(registration);
  } catch (err) {
    console.error('Registration error:', err);
    // Return more detailed error message
    res.status(500).json({
      message: 'Error saving registration',
      error: err.message
    });
  }
};

// Upload photo
export const uploadPhoto = async (req, res) => {
  try {
    const photo = new Photo({
      userId: req.user.id,
      ...req.body
    });
    await photo.save();
    res.json(photo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Toggle photo like
export const togglePhotoLike = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ msg: 'Photo not found' });
    }

    if (photo.likes.includes(req.user.id)) {
      photo.likes = photo.likes.filter(like => like !== req.user.id);
    } else {
      photo.likes.push(req.user.id);
    }

    await photo.save();
    res.json(photo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete photo
export const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ msg: 'Photo not found' });
    }

    // Check if user owns the photo
    if (photo.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await photo.remove();
    res.json({ msg: 'Photo removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};