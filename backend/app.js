// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// console.log("✅ PORT:", process.env.PORT);
// console.log("✅ MONGO_URI:", process.env.MONGO_URI);

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const entryRoutes = require('./routes/entries');
app.use('/api/entries', entryRoutes);

// Routes (we’ll add later)
app.get('/', (req, res) => {
  res.send('EchoVerse API running');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
});

