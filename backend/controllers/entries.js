const Entry = require('../models/Entry');

exports.createEntry = async (req, res) => {
  try {
    const { title, mood, audioURL, unlockAt } = req.body;
    const newEntry = new Entry({
      title,
      mood,
      audioURL,
      unlockAt,
      userId: req.user.id
    });

    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create entry', error: err });
  }
};

exports.getUserEntries = async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch entries', error: err });
  }
};
