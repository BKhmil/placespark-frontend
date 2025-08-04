import type { FC } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

interface IDeleteAccountModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading?: boolean;
}

const DeleteAccountModal: FC<IDeleteAccountModalProps> = ({
	open,
	onClose,
	onConfirm,
	isLoading,
}) => {
	const { t } = useTranslation();

	if (!open) return null;

	return createPortal(
		<div className='fixed inset-0 z-50 bg-black/40'>
			<div className='absolute flex flex-col w-full max-w-xs max-h-screen gap-4 p-6 mx-4 overflow-y-auto -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl top-1/2 left-1/2 dark:bg-gray-900'>
				<h3 className='mb-2 text-lg font-bold text-center text-red-600'>
					{t('profile.delete_account', 'Видалити акаунт?')}
				</h3>
				<div className='mb-4 text-center text-gray-700 dark:text-gray-200'>
					{t(
						'profile.delete_confirm',
						'Ви впевнені, що хочете видалити акаунт? Це незворотньо.',
					)}
				</div>
				<button
					type='button'
					className='w-full py-2 text-white transition bg-red-600 rounded hover:bg-red-700'
					onClick={onConfirm}
					disabled={isLoading}
				>
					{t('profile.delete_account', 'Видалити акаунт')}
				</button>
				<button
					type='button'
					className='w-full py-2 mt-2 text-gray-900 transition bg-gray-200 rounded dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'
					onClick={onClose}
				>
					{t('auth.cancel', 'Скасувати')}
				</button>
			</div>
		</div>,
		document.getElementById('modal-root') as HTMLElement,
	);
};

export default DeleteAccountModal;
