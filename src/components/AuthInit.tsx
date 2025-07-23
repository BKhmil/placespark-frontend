import { useEffect, useState } from 'react';
import { LocaleStorageEntriesEnum } from '../enums/locale-storage-entries.enum';
import { useAppDispatch } from '../hooks/rtk';
import { usePingMutation } from '../redux/api/authApi';
import { userSliceActions } from '../redux/slices/userSlice';

// On the backend, I set the refresh token lifetime as 7 days. Now, on app start, we ping the backend to ensure the session is still valid.

const AuthInit = () => {
	const dispatch = useAppDispatch();
	const [ping, { isLoading }] = usePingMutation();
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		const userStr = localStorage.getItem(LocaleStorageEntriesEnum.USER);
		const refreshToken = localStorage.getItem(
			LocaleStorageEntriesEnum.REFRESH_TOKEN,
		);
		if (userStr && refreshToken) {
			ping()
				.unwrap()
				.then(() => {
					try {
						const user = JSON.parse(userStr);
						dispatch(userSliceActions.setUser(user));
					} catch {
						localStorage.removeItem(LocaleStorageEntriesEnum.USER);
						dispatch(userSliceActions.removeUser());
					}
					setChecked(true);
				})
				.catch(() => {
					localStorage.clear();
					dispatch(userSliceActions.removeUser());
					setChecked(true);
				});
		} else {
			dispatch(userSliceActions.removeUser());
			setChecked(true);
		}
	}, []);

	if (!checked || isLoading) {
		return (
			<div className='flex items-center justify-center w-full h-screen text-lg text-gray-500 dark:text-gray-300'>
				Loading...
			</div>
		);
	}

	return null;
};

export default AuthInit;
