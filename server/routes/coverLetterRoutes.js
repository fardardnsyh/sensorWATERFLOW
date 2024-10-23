const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const coverLetterController = require('../controllers/coverLetterController');
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/generate-cover-letter', 
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'previousCoverLetter', maxCount: 1 }
  ]),
  coverLetterController.generateCoverLetter
);

// Add this new route for testing
router.get('/test-gemini', async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hello, Gemini!");
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error('Test Gemini Error:', error);
    res.status(500).json({ error: error.message, details: error.response?.data });
  }
});

module.exports = router;