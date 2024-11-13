// features/nodeSlice.js
import { getAllNodes } from "@/components/DashboardElements/query-hooks";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const showAllNode = {
  keys: ["nodeTypes"],
  length: 1,
  _fields: [["Show All"]],
  _fieldLookup: { nodeTypes: 0 },
};

export const fetchAllNodes = createAsyncThunk(
  "nodes/fetchAllNodes",
  async () => {
    const data = await getAllNodes();
    return [...data.records, showAllNode];
  }
);

// export const fetchNodesByLabel = createAsyncThunk(
//   "nodes/fetchNodesByLabel",
//   async (label) => {
//     const response = await axios.post("http://localhost:6969/api/fetch-nodes", {
//       label,
//     });
//     return response.data;
//   }
// );

const initialState = {
  nodesList: [],
  selectedNodeData: null,
  loading: false,
  error: null,
};

const nodeSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchAllNodes
      .addCase(fetchAllNodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNodes.fulfilled, (state, action) => {
        state.loading = false;
        state.nodesList = action.payload;
      })
      .addCase(fetchAllNodes.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to fetch node types";
      })
      // // Handle fetchNodesByLabel
      // .addCase(fetchNodesByLabel.fulfilled, (state, action) => {
      //   state.selectedNodeData = action.payload;
      // });
  },
});

export default nodeSlice.reducer;
