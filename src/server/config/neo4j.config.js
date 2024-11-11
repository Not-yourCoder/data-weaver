import neo4j from "neo4j-driver";

const uri = process.env.INSTANCE_URL;
const password = process.env.INSTANCE_PASSWORD;
const username = process.env.INSTANCE_USERNAME;
const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

export default driver;
