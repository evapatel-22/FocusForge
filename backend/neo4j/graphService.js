const driver = require("./driver");

async function saveTaskGraph(
  uid,
  name,
  taskName,
  category
) {
  const session = driver.session();

  try {
    await session.run(
      `
MERGE (u:User {uid:$uid})
SET u.name = $name

MERGE (t:Task {name:$taskName})

MERGE (c:Category {name:$category})

MERGE (u)-[:COMPLETED]->(t)

MERGE (t)-[:BELONGS_TO]->(c)
`,
      {
        uid,
        name,
        taskName,
        category,
      }
    );

    console.log("Neo4j Graph Updated");
  } finally {
    await session.close();
  }
}

module.exports = {
  saveTaskGraph,
};