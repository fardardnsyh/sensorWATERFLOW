require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Implement rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all routes
app.use(limiter);

// File upload configuration
const upload = multer({ dest: 'uploads/' });

// Routes
const coverLetterRoutes = require('./routes/coverLetterRoutes');
app.use('/api', coverLetterRoutes);

module.exports = app;