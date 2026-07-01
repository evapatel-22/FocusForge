const fs = require("fs");
const { verifyTask } = require("../services/geminiService");
const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });
router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      const result = await verifyTask(
        req.file.path,
        req.body.taskName
      );

      fs.unlinkSync(req.file.path);

      res.json(JSON.parse(result));
    } catch (error) {
      console.error(error);

      res.status(500).json({
        verified: false,
        confidence: 0,
        reason: "AI verification failed.",
      });
    }
  }
);

module.exports = router;