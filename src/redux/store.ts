import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./Api/baseApi";
import authReducer from "./Features/Auth/authSlice";
import accontTypeReducer from "./Features/AccountSwitcher/accountSwitcher";
import {
     persistReducer,
     persistStore,
     FLUSH,
     REHYDRATE,
     PAUSE,
     PERSIST,
     PURGE,
     REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
     key: "auth",
     storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
     reducer: {
          // Add the generated reducer as a specific top-level slice
          [baseApi.reducerPath]: baseApi.reducer,
          auth: persistedAuthReducer,
          accountType: accontTypeReducer,
     },

     middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
               serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
               },
          }).concat(baseApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
