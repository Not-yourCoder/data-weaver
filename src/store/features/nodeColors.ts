// src/store/nodeColorsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface NodeColorsState {
  [key: string]: string;
}

const initialState: NodeColorsState = {
  crime: "#FF6347", // Tomato
  location: "#4682B4", // SteelBlue
  area: "#32CD32", // LimeGreen
  officer: "#FFD700", // Gold
  // Add more as needed
};

const nodeColorsSlice = createSlice({
  name: "nodeColors",
  initialState,
  reducers: {
    setNodeColor: (
      state,
      action: PayloadAction<{ nodeType: string; color: string }>
    ) => {
      const { nodeType, color } = action.payload;
      state[nodeType] = color;
    },
  },
});

export const { setNodeColor } = nodeColorsSlice.actions;
export const selectNodeColors = (state: RootState) => state.nodeColors;
export default nodeColorsSlice.reducer;
