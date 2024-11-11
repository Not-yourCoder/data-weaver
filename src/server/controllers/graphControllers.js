import driver from "../config/neo4j.config.js";

export const getGraphData = async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run("MATCH (n) RETURN n LIMIT 1000");
    const records = result.records.map((record) => record.get(0).properties);
    res.json(records);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    await session.close();
  }
};

export const postGraphNodes = async (req, res) => {
  const { label } = req.body;

  if (!label) {
    return res.status(400).json({ error: "Label is required" });
  }

  const session = driver.session();
  try {
    let query;
    if (label === "Show All") {
      // Query to match all nodes with their labels
      query = "MATCH (n) RETURN n LIMIT 1000";
    } else {
      // Otherwise, get nodes by the specific label
      query = `
      MATCH (n:${label}) RETURN n LIMIT 1000
    `;
    }
    const result = await session.run(query);

    // Extract nodes and relationships from the result
    const nodesMap = new Map();

    if (label !== "Show All") {
      result.records.forEach((record) => {
        // Get source and target nodes
        const sourceNode = record.get("n");

        // Add source node if not already added
        if (!nodesMap.has(sourceNode.elementId)) {
          nodesMap.set(sourceNode.elementId, {
            id: sourceNode.elementId,
            label: label,
            properties: sourceNode.properties,
          });
        }
      });
    }

    // Convert the nodes map to an array
    const nodes = Array.from(nodesMap.values());
    const records = result.records.map((record) => record.get(0).properties);
    return res
      .status(200)
      .json({ nodes: label === "Show All" ? records : nodes, links: [] });
  } catch (err) {
    console.log("Error occurred while sending data", err);
    res
      .status(500)
      .json({ error: "Failed to send data", details: err.message });
  } finally {
    await session.close();
  }
};

export const searchNode = async (req, res) => {
  const { query } = req.body;
  console.log("Query", query);
  const session = driver.session();

  try {
    const result = await session.run(
      `
            MATCH (n:${query})-[r]-(m) 
            RETURN n, r, m
            `,
      { query }
    );

    if (result.records.length === 0) {
      return res.status(404).json({ error: "Node not found" });
    }

    // Extract the node and relationships from the result
    const nodes = result.records[0].get("n").properties;
    const links = result.records.map((record) => ({
      target: record.get("m").properties,
      relationship: record.get("r").properties,
    }));

    res.status(200).json({ nodes, links });
  } catch (err) {
    console.error("Error searching for node:", err);
    res.status(500).json({ error: "Failed to retrieve data" });
  } finally {
    await session.close();
  }
};

export const getSuggestions = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const session = driver.session();
  try {
    const result = await session.run(
      `
      MATCH (n) 
      WHERE ANY(label IN labels(n) WHERE label STARTS WITH $query) 
        OR ANY(key IN keys(n) WHERE toString(n[key]) STARTS WITH $query)
      RETURN DISTINCT n LIMIT 10
      `,
      { query: q }
    );

    // Extract and format suggestions for the frontend
    const suggestions = result.records.map((record) => {
      const node = record.get("n");
      // Return either the primary label or a property, adjust as needed
      return node.labels[0] || node.properties.name || node.properties.title;
    });

    res.status(200).json(suggestions);
  } catch (err) {
    console.error("Error fetching search suggestions:", err);
    res.status(500).json({ error: "Failed to fetch search suggestions" });
  } finally {
    await session.close();
  }
};

export const getRelationships = async (req, res) => {
  const session = driver.session();
  try {
    const query = "CALL db.relationshipTypes()";
    const result = await session.run(query);

    // Extract relationship types from the result
    const relationshipTypes = result.records.map((record) => record.get(0));

    return res.status(200).json({ relationshipTypes });
  } catch (error) {
    console.error("Error fetching relationship types:", error);
    res.status(500).json({ error: "Failed to fetch relationship types" });
  } finally {
    await session.close();
  }
};

export const getNodesByRelationship = async (req, res) => {
  const { relationshipType } = req.body;

  if (!relationshipType) {
    return res.status(400).json({ error: "Relationship type is required" });
  }

  const session = driver.session();
  try {
    const query = `
      MATCH (n)-[r:${relationshipType}]->(m)
      RETURN n, r, m
      LIMIT 25
    `;

    const result = await session.run(query);

    // Extract nodes and relationships from the result
    const nodesMap = new Map();
    const links = [];

    if (result.records.length === 0) {
      return res
        .status(404)
        .json({
          error: `No nodes found with '${relationshipType}' relationship`,
        });
    }

    result.records.forEach((record) => {
      const sourceNode = record.get("n");
      const relationship = record.get("r");
      const targetNode = record.get("m");

      // Add source node if not already in map
      if (!nodesMap.has(sourceNode.elementId)) {
        nodesMap.set(sourceNode.elementId, {
          id: sourceNode.elementId,
          label: sourceNode.labels[0],
          properties: sourceNode.properties,
        });
      }

      // Add target node if not already in map
      if (!nodesMap.has(targetNode.elementId)) {
        nodesMap.set(targetNode.elementId, {
          id: targetNode.elementId,
          label: targetNode.labels[0],
          properties: targetNode.properties,
        });
      }

      // Add relationship to links array
      links.push({
        id: relationship.elementId,
        source: sourceNode.elementId,
        target: targetNode.elementId,
        type: relationship.type,
        properties: relationship.properties,
      });
    });

    // Convert nodes map to an array
    const nodes = Array.from(nodesMap.values());

    return res.status(200).json({ nodes, links });
  } catch (error) {
    console.error("Error fetching nodes by relationship:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  } finally {
    await session.close();
  }
};
