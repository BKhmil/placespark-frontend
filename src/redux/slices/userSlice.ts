import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IUser } from '../../interfaces/user.interface';

interface IIUserState {
	user: IUser | null;
}

const initialState: IIUserState = {
	user: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<IUser>) {
			state.user = action.payload;
		},
		removeUser(state) {
			state.user = null;
		},
		addAdminEstablishment(state, action: PayloadAction<string>) {
			if (state.user) {
				if (!Array.isArray(state.user.admin_establishments)) {
					state.user.admin_establishments = [];
				}
				state.user.admin_establishments.push(action.payload);
			}
		},
		removeAdminEstablishment(state, action: PayloadAction<string>) {
			if (state.user && Array.isArray(state.user.admin_establishments)) {
				state.user.admin_establishments =
					state.user.admin_establishments.filter((id) => id !== action.payload);
			}
		},
	},
});

export const userSliceActions = { ...userSlice.actions };
export default userSlice.reducer;
