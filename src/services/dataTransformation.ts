// import { session } from "./neo4j";

// export async function getNodes() {
//   const result = await session.executeRead(async (tx) => {
    
//     const result = await tx.run("MATCH (n) RETURN n");
//     return result.records.map((record) => record.get("n").properties);
//   });
//   return result;
// }

// export async function getRelationships() {
//   const result = await session.executeRead(async (tx) => {
//     const result = await tx.run("MATCH (n)-[r]-(m) RETURN n, type(r), m");
//     return result.records.map((record) => ({
//       source: record.get("n").properties,
//       target: record.get("m").properties,
//       relationship: record.get("type(r)"),
//     }));
//   });
//   return result;
// }

// // Close the session when done (optional but recommended)
// session.close();