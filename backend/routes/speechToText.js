const express = require("express");
const multer = require("multer");
const fs = require("fs");

const { transcribeAudio } = require("../services/sarvamService");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/speech-to-text",
  upload.single("audio"),
  async (req, res) => {
    try {
      const transcript = await transcribeAudio(req.file.path);

      fs.unlinkSync(req.file.path);

      res.json({
        success: true,
        text: transcript,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

module.exports = router;