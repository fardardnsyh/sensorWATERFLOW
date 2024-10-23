const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const pdf = require('pdf-parse');
const { Document, Paragraph, Packer } = require('docx');

const API_KEY = process.env.API_KEY || 'your_fallback_api_key_here';
const genAI = new GoogleGenerativeAI(API_KEY);

exports.generateCoverLetter = async (req, res) => {
  try {
    const { jobDescription, extraInfo } = req.body;
    
    let cv = '';
    let previousCoverLetter = '';

    if (req.files['cv']) {
      const cvBuffer = fs.readFileSync(req.files['cv'][0].path);
      const cvData = await pdf(cvBuffer);
      cv = cvData.text;
    }

    if (req.files['previousCoverLetter']) {
      const coverLetterBuffer = fs.readFileSync(req.files['previousCoverLetter'][0].path);
      const coverLetterData = await pdf(coverLetterBuffer);
      previousCoverLetter = coverLetterData.text;
    }

    // Construct prompt for Gemini API with 500-word limit
    const prompt = `Generate a cover letter of approximately 500 words based on the following information:
    CV: ${cv}
    Previous Cover Letter: ${previousCoverLetter}
    Job Description: ${jobDescription}
    Additional Information: ${extraInfo}

    Please ensure the cover letter is concise, professional, and highlights the most relevant experiences and skills from the CV that match the job description. The cover letter should be no more than 500 words.
    Keep the heading of cover letter same as the previous cover letter.
    `;

    // Use Gemini to generate content
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const generatedCoverLetter = result.response.text();

    // Create a new document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: generatedCoverLetter
          }),
        ],
      }],
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);

    // Convert buffer to base64
    const base64 = buffer.toString('base64');

    console.log('Generated cover letter length:', generatedCoverLetter.length);
    console.log('Base64 document length:', base64.length);

    // Send the base64 encoded document and the plain text
    res.json({ 
      coverLetter: generatedCoverLetter,
      docxBase64: base64
    });

  } catch (error) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ error: 'An error occurred while generating the cover letter', details: error.message });
  }
};

