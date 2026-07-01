const driver = require("./driver");

async function getUserHistory(uid) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
MATCH (u:User {uid:$uid})-[:COMPLETED]->(t:Task)-[:BELONGS_TO]->(c:Category)

RETURN
t.name AS task,
c.name AS category

ORDER BY task
`,
      { uid }
    );

    return result.records.map(record => ({
      task: record.get("task"),
      category: record.get("category"),
    }));

  } finally {
    await session.close();
  }
}

module.exports = {
  getUserHistory,
};