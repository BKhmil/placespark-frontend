import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IUser } from '../../interfaces/user.interface';

interface IIUserState {
	user: IUser | null;
	isAuthenticated: boolean;
}

const initialState: IIUserState = {
	user: null,
	isAuthenticated: false,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<IIUserState['user']>) {
			state.user = action.payload;
			state.isAuthenticated = !!action.payload;
		},
		removeUser(state) {
			state.user = null;
			state.isAuthenticated = false;
		},
	},
});

export const userSliceActions = { ...userSlice.actions };
export default userSlice.reducer;
