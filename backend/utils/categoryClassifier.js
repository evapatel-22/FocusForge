function getCategory(taskName) {
  const task = taskName.toLowerCase();

  const categories = {
    Mathematics: [
      "math",
      "algebra",
      "geometry",
      "calculus",
      "trigonometry",
      "statistics",
    ],

    "Computer Science": [
      "dbms",
      "sql",
      "react",
      "react native",
      "javascript",
      "typescript",
      "python",
      "java",
      "coding",
      "programming",
      "algorithm",
      "gate",
      "firebase",
      "node",
      "express",
      "api",
    ],

    Study: [
      "assignment",
      "homework",
      "revision",
      "notes",
      "lecture",
      "study",
      "exam",
    ],

    Fitness: [
      "gym",
      "exercise",
      "workout",
      "running",
      "walk",
      "cycling",
      "yoga",
    ],

    Reading: [
      "book",
      "read",
      "novel",
      "article",
    ],

    Art: [
      "drawing",
      "painting",
      "design",
      "sketch",
      "illustration",
    ],
  };

  for (const category in categories) {
    for (const keyword of categories[category]) {
      if (task.includes(keyword)) {
        return category;
      }
    }
  }

  return "General";
}

module.exports = {
  getCategory,
};