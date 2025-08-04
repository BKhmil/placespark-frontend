import { type FC } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LocaleStorageKeysEnum } from '../enums/locale-storage-keys.enum';
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

	const handleLogout = (isAll: boolean = false) => {
		return async () => {
			try {
				if (isAll) {
					await logoutAll().unwrap();
				} else {
					await logout().unwrap();
				}
			} catch {
				// network error: anyway make logout locally
			} finally {
				localStorage.removeItem(LocaleStorageKeysEnum.ACCESS_TOKEN);
				localStorage.removeItem(LocaleStorageKeysEnum.REFRESH_TOKEN);
				sessionStorage.clear();
				dispatch(userSliceActions.removeUser());
				onClose();
				navigate('/');
			}
		};
	};

	if (!open) return null;

	return createPortal(
		<div className='fixed inset-0 z-50 bg-black/40'>
			<div className='absolute flex flex-col w-full max-w-xs max-h-screen gap-4 p-6 mx-4 overflow-y-auto -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl top-1/2 left-1/2 dark:bg-gray-900'>
				<h3 className='mb-2 text-lg font-bold text-center'>
					{t('auth.logout_title')}
				</h3>
				<button
					type='button'
					className='w-full py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700'
					onClick={async () => await handleLogout(false)()}
					disabled={isLoadingLogout}
				>
					{t('auth.logout_this')}
				</button>
				<button
					type='button'
					className='w-full py-2 text-gray-900 transition bg-gray-200 rounded dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'
					onClick={async () => await handleLogout(true)()}
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
		</div>,
		document.getElementById('modal-root') as HTMLElement,
	);
};

export default LogoutModal;
