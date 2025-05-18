const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  mood: { type: String },
  audioURL: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  unlockAt: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Entry', entrySchema);
