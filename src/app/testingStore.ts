import { configureStore } from "@reduxjs/toolkit";
import {
  authMiddleware,
  loggerMiddleware,
} from "../features/testing_Slices/testing_middleware";

export const rootStore = configureStore({
  reducer: {
    // Add your reducers here for testing
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([loggerMiddleware, authMiddleware]),
});

export type RootState = ReturnType<typeof rootStore.getState>;
export type AppDispatch = typeof rootStore.dispatch;
