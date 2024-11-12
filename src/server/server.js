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
