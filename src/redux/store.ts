import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { placeApi } from './api/placeApi';
import { userApi } from './api/userApi';
import userReducer from './slices/userSlice';

export const store = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		[placeApi.reducerPath]: placeApi.reducer,
		[userApi.reducerPath]: userApi.reducer,
		user: userReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			authApi.middleware,
			placeApi.middleware,
			userApi.middleware,
		),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
