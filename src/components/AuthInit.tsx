import { useEffect, useState } from 'react';
import { LocaleStorageKeysEnum } from '../enums/locale-storage-keys.enum';
import { useAppDispatch } from '../hooks/rtk';
import { usePingMutation } from '../redux/api/authApi';
import { useGetMeQuery } from '../redux/api/userApi';
import { userSliceActions } from '../redux/slices/userSlice';
import { SessionStorageKeysEnum } from "../enums/session-storage-keys";

const AuthInit = () => {
	const dispatch = useAppDispatch();
	const [ping, { isLoading: isPinging }] = usePingMutation();
	const [checked, setChecked] = useState(false);
	const [shouldFetchMe, setShouldFetchMe] = useState(false);

	const {
		data: user,
		isSuccess: isMeSuccess,
		isError: isMeError,
	} = useGetMeQuery(undefined, { skip: !shouldFetchMe });

	useEffect(() => {
		const refreshToken = localStorage.getItem(
			LocaleStorageKeysEnum.REFRESH_TOKEN,
		);
		const isPinged = sessionStorage.getItem(SessionStorageKeysEnum.IS_PINGED);

		if (refreshToken) {
			if (isPinged) {
				setShouldFetchMe(true);
				setChecked(true);
			} else {
				ping()
					.unwrap()
					.then(() => {
						sessionStorage.setItem(SessionStorageKeysEnum.IS_PINGED, JSON.stringify(true));
						setShouldFetchMe(true);
						setChecked(true);
					})
					.catch(() => {
						localStorage.clear();
						dispatch(userSliceActions.removeUser());
						setChecked(true);
					});
			}
		} else {
			dispatch(userSliceActions.removeUser());
			setChecked(true);
		}
	}, []);

	useEffect(() => {
		if (isMeSuccess && user) {
			dispatch(userSliceActions.setUser(user));
		}
		if (isMeError) {
			dispatch(userSliceActions.removeUser());
		}
	}, [isMeSuccess, isMeError, user, dispatch]);

	if (!checked || isPinging) {
		return (
			<div className='flex items-center justify-center w-full h-screen text-lg text-gray-500 dark:text-gray-300'>
				Loading...
			</div>
		);
	}

	return null;
};

export default AuthInit;
