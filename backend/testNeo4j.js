require("dotenv").config();

const driver = require("./neo4j/driver");

async function test() {
  const session = driver.session();

  try {
    const result = await session.run(
      "RETURN 'Neo4j Connected Successfully 🚀' AS message"
    );

    console.log(result.records[0].get("message"));
  } catch (err) {
    console.error(err);
  } finally {
    await session.close();
    await driver.close();
  }
}

test();