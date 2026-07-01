require("dotenv").config();

const { SarvamAIClient } = require("sarvamai");

async function test() {
  try {
    const client = new SarvamAIClient({
      apiSubscriptionKey: process.env.SARVAM_API_KEY,
    });

    console.log("✅ Sarvam client initialized successfully");
  } catch (err) {
    console.error(err);
  }
}

test();