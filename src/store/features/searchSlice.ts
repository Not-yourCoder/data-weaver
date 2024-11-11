import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  searchActive: boolean;
}

const initialState: SearchState = {
  searchActive: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchActive(state, action: PayloadAction<boolean>) {
      state.searchActive = action.payload;
    },
  },
});

export const { setSearchActive } = searchSlice.actions;
export default searchSlice.reducer;
