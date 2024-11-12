import axios from "axios";

export const fetchSearchResults = async ({
  searchTerm,
  label,
}: {
  searchTerm: string;
  label: string;
}) => {
  const response = await axios.post("http://localhost:6969/api/search-query", {
    query: searchTerm.trim(),
    label: label,
  });
  if (!response.data.nodes) {
    throw new Error(response.data.message || "No nodes found");
  }
  return response.data;
};