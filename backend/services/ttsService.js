const { SarvamAIClient } = require("sarvamai");

const client = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY,
});

async function generateSpeech(text) {
  const response =
    await client.textToSpeech.convert({
      text,
      target_language_code: "en-IN",
      speaker: "shubh",
      pace: 1,
      speech_sample_rate: 22050,
      enable_preprocessing: true,
      model: "bulbul:v3",
    });
  console.log(response);
  return response.audios[0];
}

module.exports = {
  generateSpeech,
};