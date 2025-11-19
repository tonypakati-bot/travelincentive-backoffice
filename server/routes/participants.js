import express from 'express';
import Participant from '../models/Participant.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const participants = await Participant.find();
  res.json(participants);
});

router.post('/', async (req, res) => {
  const payload = { ...req.body };
  delete payload._id;
  delete payload.id;
  const created = await Participant.create(payload);
  res.status(201).json(created);
});

router.put('/:id', async (req, res) => {
  const payload = { ...req.body };
  delete payload._id;
  delete payload.id;
  const updated = await Participant.findByIdAndUpdate(req.params.id, payload, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Participant.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
