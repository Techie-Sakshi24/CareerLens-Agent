const axios = require('axios');

const FOUNDRY_ENDPOINT = process.env.AZURE_FOUNDRY_ENDPOINT;
const FOUNDRY_API_KEY = process.env.AZURE_FOUNDRY_API_KEY;

// Step 1: Extract requirements from JD
async function extractRequirements(jobDescription) {
  const prompt = `You are a technical recruiter. Read this job description carefully.

Extract and return JSON with exactly this structure:
{
  "role": "job title",
  "required_skills": ["skill1", "skill2"],
  "preferred_skills": ["skill1", "skill2"],
  "experience_level": "fresher/junior/mid/senior",
  "key_responsibilities": ["responsibility1", "responsibility2"],
  "company_context": "one sentence about what the company does"
}

Job Description:
${jobDescription}

Return only valid JSON, nothing else.`;

  const response = await callFoundry(prompt);
  return JSON.parse(response);
}

// Step 2: Match resume against requirements
async function matchResumeToJD(resumeText, requirements) {
  const prompt = `You are a career counselor doing a resume review.

Here are the job requirements:
${JSON.stringify(requirements, null, 2)}

Here is the candidate's resume:
${resumeText}

Compare them carefully and return JSON with exactly this structure:
{
  "strong_matches": [{"skill": "skill name", "evidence": "where in resume"}],
  "partial_matches": [{"skill": "skill name", "evidence": "closest thing in resume", "gap": "what's missing"}],
  "missing_skills": ["skill1", "skill2"],
  "overall_match_score": 0-100,
  "match_summary": "2-3 sentence honest assessment"
}

Return only valid JSON, nothing else.`;

  const response = await callFoundry(prompt);
  return JSON.parse(response);
}

// Step 3: Generate tailored resume bullets
async function generateResumeBullets(resumeText, requirements, matchResult) {
  const prompt = `You are a resume writer helping a fresher developer get their first job.

Job role: ${requirements.role}
Key skills needed: ${requirements.required_skills.join(', ')}
Candidate's current resume: ${resumeText}
Match analysis: ${JSON.stringify(matchResult.strong_matches)}

Write 4-5 resume bullet points that:
- Highlight existing experience relevant to this specific role
- Use strong action verbs
- Are honest (don't invent experience)
- Are concise (one line each)

Return JSON:
{
  "bullets": ["bullet1", "bullet2", "bullet3", "bullet4", "bullet5"]
}

Return only valid JSON, nothing else.`;

  const response = await callFoundry(prompt);
  return JSON.parse(response);
}

// Step 4: Write cold outreach message
async function generateOutreachMessage(requirements, matchResult) {
  const prompt = `Write a LinkedIn cold outreach message from a fresher developer to a recruiter or hiring manager.

Role they're applying for: ${requirements.role}
Company context: ${requirements.company_context}
Candidate's strong skills: ${matchResult.strong_matches.map(m => m.skill).join(', ')}
Match score: ${matchResult.overall_match_score}/100

The message should:
- Be under 100 words
- Sound like a real person wrote it, not a template
- Mention one specific thing about the role
- End with a clear ask

Return JSON:
{
  "subject": "LinkedIn message subject line",
  "message": "the full message text"
}

Return only valid JSON, nothing else.`;

  const response = await callFoundry(prompt);
  return JSON.parse(response);
}

// Core Foundry API call with Foundry IQ grounding
async function callFoundry(userPrompt) {
  try {
    const response = await axios.post(
      `${FOUNDRY_ENDPOINT}/openai/deployments/gpt-4o/chat/completions?api-version=2024-05-01-preview`,
      {
        messages: [
          {
            role: 'system',
            content: 'You are CareerLens, a career intelligence agent. Always respond with valid JSON only. No markdown, no explanation, just the JSON object requested.'
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3,
        // Foundry IQ grounding configuration
        data_sources: [
          {
            type: 'azure_search',
            parameters: {
              endpoint: process.env.AZURE_SEARCH_ENDPOINT || '',
              key: process.env.AZURE_SEARCH_KEY || '',
              index_name: process.env.AZURE_SEARCH_INDEX || 'careerlens-knowledge'
            }
          }
        ]
      },
      {
        headers: {
          'api-key': FOUNDRY_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    return content.replace(/```json|```/g, '').trim();
  } catch (error) {
    // Fallback: call without Foundry IQ if search index not configured
    if (error.response?.status === 400 || !process.env.AZURE_SEARCH_ENDPOINT) {
      return await callFoundryDirect(userPrompt);
    }
    throw error;
  }
}

// Direct Foundry call without search grounding (fallback / dev mode)
async function callFoundryDirect(userPrompt) {
  const response = await axios.post(
    `${FOUNDRY_ENDPOINT}/openai/deployments/gpt-4o/chat/completions?api-version=2024-05-01-preview`,
    {
      messages: [
        {
          role: 'system',
          content: 'You are CareerLens, a career intelligence agent. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3
    },
    {
      headers: {
        'api-key': FOUNDRY_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  );

  const content = response.data.choices[0].message.content;
  return content.replace(/```json|```/g, '').trim();
}

module.exports = {
  extractRequirements,
  matchResumeToJD,
  generateResumeBullets,
  generateOutreachMessage
};
