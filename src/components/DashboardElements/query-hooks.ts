import axios from "axios";


export const getAllNodes = async () => {
  try {
    const response = await axios.get("http://localhost:6969/api/nodeTypes");
    return response.data;
  } catch (err) {
    console.error("Error fetching node types:", err);
    throw new Error("Failed to fetch node types");
  }
};
export const getAllLinks = async () => {
  try {
    const response = await axios.get("http://localhost:6969/api/fetch-links");
    return response.data;
  } catch (err) {
    console.error("Error fetching node types:", err);
    throw new Error("Failed to fetch node types");
  }
};


