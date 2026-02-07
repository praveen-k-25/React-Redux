import type { Middleware } from "redux";

export const loggerMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    console.log("Logger → before", action.type);

    const result = next(action); // pass to next middleware

    console.log("Logger → after", store.getState());
    return result;
  };

export const authMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    if (action.type.startsWith("secure/")) {
      const token = store.getState().auth.token;
      if (!token) return; // ❌ block action
    }

    return next(action); // pass to reducer
  };
