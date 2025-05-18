const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { createEntry, getUserEntries } = require('../controllers/entries');

router.post('/', authenticate, createEntry);
router.get('/', authenticate, getUserEntries);

module.exports = router;
