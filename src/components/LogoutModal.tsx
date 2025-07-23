import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LocaleStorageEntriesEnum } from '../enums/locale-storage-entries.enum';
import { useAppDispatch } from '../hooks/rtk';
import { useLogoutAllMutation, useLogoutMutation } from '../redux/api/authApi';
import { userSliceActions } from '../redux/slices/userSlice';

interface ILogoutModalProps {
	open: boolean;
	onClose: () => void;
}

const LogoutModal: FC<ILogoutModalProps> = ({ open, onClose }) => {
	const [logout, { isLoading: isLoadingLogout }] = useLogoutMutation();
	const [logoutAll, { isLoading: isLoadingLogoutAll }] = useLogoutAllMutation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();

	if (!open) return null;

	const handleLogout = (isAll: boolean = false) => {
		return async () => {
			if (isAll) {
				await logoutAll().unwrap();
			} else {
				await logout().unwrap();
			}

			localStorage.removeItem(LocaleStorageEntriesEnum.ACCESS_TOKEN);
			localStorage.removeItem(LocaleStorageEntriesEnum.REFRESH_TOKEN);
			localStorage.removeItem(LocaleStorageEntriesEnum.USER);
			dispatch(userSliceActions.removeUser());
			onClose();
			navigate('/');
		};
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
			<div className='flex flex-col w-full max-w-xs gap-4 p-6 bg-white rounded-lg shadow-xl dark:bg-gray-900'>
				<h3 className='mb-2 text-lg font-bold text-center'>
					{t('auth.logout_title')}
				</h3>
				<button
					type='button'
					className='w-full py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700'
					onClick={handleLogout()}
					disabled={isLoadingLogout}
				>
					{t('auth.logout_this')}
				</button>
				<button
					type='button'
					className='w-full py-2 text-gray-900 transition bg-gray-200 rounded dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'
					onClick={handleLogout(true)}
					disabled={isLoadingLogoutAll}
				>
					{t('auth.logout_all')}
				</button>
				<button
					type='button'
					className='w-full py-2 mt-2 text-red-600 transition bg-red-100 rounded dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
					onClick={onClose}
				>
					{t('auth.cancel')}
				</button>
			</div>
		</div>
	);
};

export default LogoutModal;
