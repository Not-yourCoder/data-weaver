import express from "express";
import cors from "cors";
import "dotenv/config";
import driver from "./config/neo4j.config.js";
import graphRoutes from "./routes/graphRoutes.js";


const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api", graphRoutes);

// Endpoint to get nodes and relationships
app.get("/api/graph", async (req, res) => {
  const session = driver.session();

  try {
    // Cypher query optimized for link analysis
    const result = await session.run(`
      MATCH (n)
      WITH n LIMIT 200 
      MATCH (n)-[r]->(m)
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

app.get("/api/nodeTypes", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(
      "MATCH (n) RETURN DISTINCT labels(n) AS nodeTypes"
    );
    res.json(result);
  } catch (error) {
    console.error("Error fetching node types:", error);
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
