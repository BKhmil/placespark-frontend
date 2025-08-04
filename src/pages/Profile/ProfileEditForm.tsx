import { joiResolver } from '@hookform/resolvers/joi';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DeleteAccountModal from '../../components/DeleteAccountModal';
import PhotoUploader from '../../components/PhotoUploader';
import { useAppDispatch, useAppSelector } from '../../hooks/rtk';
import {
	useDeleteMeMutation,
	useUpdateMeMutation,
	useUpdatePhotoMutation,
} from '../../redux/api/userApi';
import { userSliceActions } from '../../redux/slices/userSlice';
import { UserValidator } from '../../validators/user.validator';

const ProfileEditForm = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.user.user);
	const [updateMe, { isLoading, isSuccess }] = useUpdateMeMutation();
	const [deleteMe, { isLoading: isDeleting }] = useDeleteMeMutation();
	const [updatePhoto] = useUpdatePhotoMutation();
	const navigate = useNavigate();
	const [successMsg, setSuccessMsg] = useState('');
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const userId = user?._id;

	const {
		handleSubmit,
		register,
		formState: { errors },
		reset,
	} = useForm<{ name: string }>({
		defaultValues: { name: user?.name || '' },
		resolver: joiResolver(UserValidator.updateMe),
	});

	useEffect(() => {
		if (isSuccess) {
			setSuccessMsg(t('profile.update_success', 'Профіль оновлено!'));
			setTimeout(() => setSuccessMsg(''), 2000);
			reset({ name: user?.name || '' });
		}
	}, [isSuccess, t, reset, user?.name]);

	const handlePhotoUpload = async (file: File) => {
		if (!userId) throw new Error('User not found');
		const data = await updatePhoto({ userId, photo: file }).unwrap();
		dispatch(userSliceActions.setUser(data));
		return data;
	};

	const onSubmit = async (data: { name: string }) => {
		const res = await updateMe({ name: data.name.trim() }).unwrap();
		dispatch(userSliceActions.setUser(res));
	};

	const handleDeleteAccount = async () => {
		try {
			await deleteMe().unwrap();
		} catch {
			//
		}
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		sessionStorage.clear();
		dispatch(userSliceActions.removeUser());
		navigate('/');
	};

	return (
		<div className='flex flex-col max-w-sm gap-8 mx-auto'>
			<div className='flex flex-col gap-4 p-4 bg-white border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-900'>
				<h2 className='mb-2 text-lg font-semibold'>
					{t('profile.edit_name', 'Оновлення імені')}
				</h2>
				<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
					<label className='block mb-1 font-medium text-gray-700 dark:text-gray-200'>
						{t('profile.name', 'Імʼя')}
						<input type='text' {...register('name')} className='input' />
						{errors.name?.message && (
							<div className='text-red-500'>{t(errors.name.message!)}</div>
						)}
					</label>
					<button
						type='submit'
						className='btn btn-primary'
						disabled={isLoading}
					>
						{t('profile.save', 'Зберегти')}
					</button>
					{successMsg && <div className='text-green-600'>{successMsg}</div>}
				</form>
			</div>
			<div className='my-4 border-t border-gray-300 dark:border-gray-700'></div>
			<div className='flex flex-col gap-4 p-4 bg-white border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-900'>
				<h2 className='mb-2 text-lg font-semibold'>
					{t('profile.edit_photo', 'Оновлення фото профілю')}
				</h2>
				<PhotoUploader
					label={t('profile.photo', 'Фото профілю')}
					initialPhoto={user?.photo}
					uploadFn={handlePhotoUpload}
					className='mb-2'
				/>
			</div>
			<div className='my-4 border-t border-gray-300 dark:border-gray-700'></div>
			<button
				type='button'
				className='mt-2 btn btn-danger'
				onClick={() => setDeleteModalOpen(true)}
				disabled={isDeleting}
			>
				{t('profile.delete_account', 'Видалити акаунт')}
			</button>
			<DeleteAccountModal
				open={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={handleDeleteAccount}
				isLoading={isDeleting}
			/>
		</div>
	);
};

export default ProfileEditForm;
