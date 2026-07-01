const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function verifyTask(imagePath, taskName) {
  const imageBytes = fs.readFileSync(imagePath);

  const prompt = `
You are an AI verification system for a productivity app.

The user claims they completed this task:

"${taskName}"

Look at the uploaded image and decide whether it provides reasonable evidence that the task was completed.

Return ONLY valid JSON in this format:

{
  "verified": true,
  "confidence": 95,
  "reason": "Short explanation"
}
`;

  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Gemini attempt ${attempt}`);

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        config: {
          responseMimeType: "application/json",
        },
        contents: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBytes.toString("base64"),
            },
          },
        ],
      });

      return response.text;
    } catch (err) {
      console.log(
        `Gemini failed (attempt ${attempt}):`,
        err.status || err.message
      );

      if (attempt === MAX_RETRIES) {
        throw err;
      }

      // Wait before retrying (2s, then 4s)
      const delay = 2000 * attempt;

      await new Promise((resolve) =>
        setTimeout(resolve, delay)
      );
    }
  }
}

async function generateRecommendation(history) {
  const prompt = `
You are an AI productivity coach.

The user has completed these tasks:

${history
  .map(
    (h) =>
      `- ${h.task} (${h.category})`
  )
  .join("\n")}

Your job is to recommend ONE NEW task.

Rules:

1. Never repeat any completed task.
2. Recommend a task from a DIFFERENT category whenever possible.
3. If multiple good tasks exist, choose one randomly.
4. Every time this prompt is called, try to produce a different recommendation.

Return ONLY valid JSON.

{
  "task": "...",
  "reason": "..."
}
`;


  const response =
    await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      config: {
        responseMimeType:
          "application/json",
      },
      contents: [
        {
          text: prompt,
        },
      ],
    });

  return response.text;
}

module.exports = {
  verifyTask,
  generateRecommendation,

};