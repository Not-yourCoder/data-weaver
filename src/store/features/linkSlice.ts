// features/linkSlice.js
import { getAllLinks } from "@/components/DashboardElements/query-hooks";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllLinks = createAsyncThunk(
  "links/fetchAllLinks",
  async () => {
    const data = await getAllLinks();
    return [...data.relationshipTypes, "SHOW ALL"];
  }
);

export const fetchNodesbyLinks = createAsyncThunk(
  "links/fetchNodesbyLinks",
  async (relationshipType) => {
    const response = await axios.post(
      "http://localhost:6969/api/fetch-relationships",
      { relationshipType }
    );
    return response.data;
  }
);

const initialState = {
  linksList: [],
  selectedLinkData: null,
  loading: false,
  error: null,
};

const linkSlice = createSlice({
  name: "links",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchAllLinks
      .addCase(fetchAllLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.linksList = action.payload;
      })
      .addCase(fetchAllLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to fetch relationship types";
      })
      // Handle fetchLinksByType
      .addCase(fetchNodesbyLinks.fulfilled, (state, action) => {
        state.selectedLinkData = action.payload;
      });
  },
});

export default linkSlice.reducer;
