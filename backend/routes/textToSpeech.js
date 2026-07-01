const express = require("express");

const {
  generateSpeech,
} = require("../services/ttsService");

const router = express.Router();

router.post(
  "/text-to-speech",
  async (req, res) => {
    try {
      const audio =
        await generateSpeech(
          req.body.text
        );

      res.json({
        success: true,
        audio,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
      });
    }
  }
);

module.exports = router;