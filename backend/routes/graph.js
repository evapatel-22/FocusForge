const express = require("express");
const { saveTaskGraph } = require("../neo4j/graphService");
const { getCategory } = require("../utils/categoryClassifier");

const router = express.Router();

router.post("/graph/save-task", async (req, res) => {
  try {
    const {
    uid,
    name,
    taskName
} = req.body;

    if (!uid || !taskName) {
      return res.status(400).json({
        success: false,
        message: "uid and taskName are required",
      });
    }

    const category = getCategory(taskName);

    await saveTaskGraph(
    uid,
    name,
    taskName,
    category
);

    res.json({
      success: true,
      category,
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