const { SarvamAIClient } = require("sarvamai");
const fs = require("fs");

const client = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY,
});

async function transcribeAudio(filePath) {
  const response = await client.speechToText.transcribe({
    file: fs.createReadStream(filePath),
    model: "saaras:v3",
    mode: "transcribe",
    languageCode: "en-IN",
  });

  return response.transcript;
}

module.exports = {
  transcribeAudio,
};