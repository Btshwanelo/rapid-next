import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../slices/authSlice';
import projectReducer from '../slices/projectSlice';
import { apiSlice } from '@/slices/apiSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

// Configuring persistence
const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'auth','project'
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
