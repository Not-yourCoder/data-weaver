import express from "express";
import neo4j from "neo4j-driver";
import cors from "cors";
import "dotenv/config";

const app = express();

const port = process.env.PORT;
const uri = process.env.INSTANCE_URL;
const password = process.env.INSTANCE_PASSWORD;
const username = process.env.INSTANCE_USERNAME;
const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

app.use(cors());

// Endpoint to get nodes only
app.get("/api/graph-data", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run("MATCH (n) RETURN n LIMIT 10");
    const records = result.records.map((record) => record.get(0).properties);
    res.json(records);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    await session.close();
  }
});

// Endpoint to get nodes and relationships
app.get("/api/graph", async (req, res) => {
  const session = driver.session();

  try {
    // Cypher query optimized for link analysis
    const result = await session.run(`
      MATCH (n)
      WITH n LIMIT 500  // Get first 100 nodes
      MATCH (n)-[r]->(m)  // Get their relationships
      RETURN DISTINCT 
        n AS source,
        r AS relationship,
        m AS target,
        labels(n) AS sourceLabels,
        labels(m) AS targetLabels,
        type(r) AS relationshipType
    `);

    // Format for visualization
    const nodes = new Map();
    const links = [];

    result.records.forEach((record) => {
      const source = record.get("source");
      const target = record.get("target");
      const relationship = record.get("relationship");

      // Add source node if not exists
      if (!nodes.has(source.elementId)) {
        nodes.set(source.elementId, {
          id: source.elementId,
          label: record.get("sourceLabels")[0], // First label
          type: record.get("sourceLabels")[0], // Useful for visual grouping
          properties: {
            ...source.properties,
            // Add any specific properties you want to display
          },
        });
      }

      // Add target node if not exists
      if (!nodes.has(target.elementId)) {
        nodes.set(target.elementId, {
          id: target.elementId,
          label: record.get("targetLabels")[0],
          type: record.get("targetLabels")[0],
          properties: {
            ...target.properties,
            // Add any specific properties you want to display
          },
        });
      }

      // Add relationship
      links.push({
        id: relationship.elementId,
        source: source.elementId,
        target: target.elementId,
        type: record.get("relationshipType"),
        properties: relationship.properties,
      });
    });

    // Return formatted data
    res.status(200).json({
      nodes: Array.from(nodes.values()),
      links: links,
    });
  } catch (error) {
    console.error("Error fetching graph data:", error);
    res.status(500).json({ message: "Error fetching graph data", error });
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
