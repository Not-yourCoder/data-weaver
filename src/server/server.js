import express from "express";
import neo4j from "neo4j-driver";
import cors from "cors";

const app = express();
const port = 6969;

const driver = neo4j.driver(
  "neo4j+s://1ac699e7.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "FZKPqFLvSWZfDBrCkJUFXKr-ug963QzUEa7VZnte9w8")
);

app.use(cors());
app.get("/api/data", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run("MATCH (n) RETURN n LIMIT 25");
    const records = result.records.map((record) => record.get(0).properties);
    res.json(records);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    await session.close();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Close the driver when the app exits
process.on("exit", async () => {
  await driver.close();
});
