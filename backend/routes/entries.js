const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });
const auth = require('../middleware/auth');
const Entry = require('../models/Entry');

// POST - Upload and save audio entry
router.post('/', auth, upload.single('audio'), async (req, res) => {
  try {
    const { title, mood, unlockAt } = req.body;
    const audioURL = req.file.path;

    const entry = new Entry({
      title,
      mood,
      unlockAt,
      audioURL,
      userId: req.user.id,
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save entry', error: err.message });
  }
});

// GET - Fetch entries with lock/unlock handling
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const now = new Date();

    const processed = entries.map(entry => {
      const isLocked = new Date(entry.unlockAt) > now;
      return {
        _id: entry._id,
        title: isLocked ? '🔒 Locked Entry' : entry.title,
        mood: entry.mood,
        createdAt: entry.createdAt,
        unlockAt: entry.unlockAt,
        isLocked,
        audioURL: isLocked ? null : entry.audioURL
      };
    });

    res.json(processed);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch entries', error: err.message });
  }
});

module.exports = router;
