// app/store.js
import { configureStore } from "@reduxjs/toolkit";
import graphReducer from "./features/graphSlice";
import nodeReducer from "./features/nodeSlice"
import linkReducer from "./features/linkSlice";
import searchReducer from "./features/searchSlice";
import nodeColorsReducer from "./features/nodeColors"



export const store = configureStore({
  reducer: {
    graph: graphReducer,
    nodes: nodeReducer,
    links: linkReducer,
    search: searchReducer,
    nodeColors: nodeColorsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;