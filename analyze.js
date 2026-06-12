const express = require('express');
const router = express.Router();
const {
  extractRequirements,
  matchResumeToJD,
  generateResumeBullets,
  generateOutreachMessage
} = require('../services/foundryService');

// POST /api/analyze
// Body: { jobDescription: string, resumeText: string }
router.post('/', async (req, res) => {
  const { jobDescription, resumeText } = req.body;

  if (!jobDescription || !resumeText) {
    return res.status(400).json({ error: 'Both jobDescription and resumeText are required.' });
  }

  try {
    // Step 1
    console.log('[CareerLens] Step 1: Extracting JD requirements...');
    const requirements = await extractRequirements(jobDescription);

    // Step 2
    console.log('[CareerLens] Step 2: Matching resume to JD...');
    const matchResult = await matchResumeToJD(resumeText, requirements);

    // Step 3
    console.log('[CareerLens] Step 3: Generating resume bullets...');
    const bullets = await generateResumeBullets(resumeText, requirements, matchResult);

    // Step 4
    console.log('[CareerLens] Step 4: Writing outreach message...');
    const outreach = await generateOutreachMessage(requirements, matchResult);

    console.log('[CareerLens] Pipeline complete.');

    res.json({
      success: true,
      steps: {
        requirements,
        matchResult,
        bullets,
        outreach
      }
    });
  } catch (error) {
    console.error('[CareerLens] Pipeline error:', error.message);
    res.status(500).json({
      error: 'Analysis failed. Check your Foundry credentials and try again.',
      detail: error.message
    });
  }
});

module.exports = router;
