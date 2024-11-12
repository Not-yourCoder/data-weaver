import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchGraphData = createAsyncThunk(
  "graph/fetchGraphData",
  async () => {
    const response = await fetch("http://localhost:6969/api/graph");
    if (!response.ok) throw new Error("Failed to fetch graph data");
    const data = await response.json();
    return data;
  }
);

interface GraphState {
  nodes: any[];
  links: any[];
  loading: boolean;
  error: string | null;
  selectedNode: any | null;
}

const initialState: GraphState = {
  nodes: [],
  links: [],
  loading: false,
  error: null,
  selectedNode: null,
};

const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    setSelectedNode: (state, action) => {
      state.selectedNode = action.payload;
    },
    clearSelectedNode: (state) => {
      state.selectedNode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGraphData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGraphData.fulfilled, (state, action) => {
        console.log("Payload", action.payload)
        state.loading = false;
        state.nodes = action.payload.nodes;
        state.links = action.payload.links || [];
      })
      .addCase(fetchGraphData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { setSelectedNode, clearSelectedNode } = graphSlice.actions;
export default graphSlice.reducer;
