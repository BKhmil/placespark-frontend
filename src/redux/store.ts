import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { placeApi } from './api/placeApi';
import userReducer from './slices/userSlice';

export const store = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		[placeApi.reducerPath]: placeApi.reducer,
		user: userReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(authApi.middleware, placeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
