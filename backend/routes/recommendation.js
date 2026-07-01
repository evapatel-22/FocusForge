const express = require("express");
const { getUserHistory } = require("../neo4j/recommendationService");
const { generateRecommendation } = require("../services/geminiService");

const router = express.Router();

router.post("/recommendation", async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "uid is required",
      });
    }

    const history = await getUserHistory(uid);

    if (history.length === 0) {
      return res.json({
        success: true,
        recommendation: {
          task: "Start your first focus session",
          reason:
            "Complete a session to receive personalized recommendations.",
        },
      });
    }

    const result = await generateRecommendation(history);

    res.json({
      success: true,
      recommendation: JSON.parse(result),
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;