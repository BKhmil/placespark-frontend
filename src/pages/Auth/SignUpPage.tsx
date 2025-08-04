import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LocaleStorageKeysEnum } from '../../enums/locale-storage-keys.enum';
import { RoleEnum } from '../../enums/role.enum';
import { useAppDispatch } from '../../hooks/rtk';
import type { ISignUpRequest } from '../../interfaces/auth.interface';
import { useSignUpMutation } from '../../redux/api/authApi';
import { userSliceActions } from '../../redux/slices/userSlice';
import { UserValidator } from '../../validators/user.validator';

const SignUpPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<ISignUpRequest>();
	const [signUp, { isLoading, isError, isSuccess }] = useSignUpMutation();
	const [successMsg, setSuccessMsg] = useState('');
	const navigate = useNavigate();
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const onSubmit = async (data: ISignUpRequest) => {
		const { error } = UserValidator.signUp.validate(data, {
			abortEarly: false,
		});
		if (error) {
			error.details.forEach((err) => {
				if (err.path[0]) {
					setError(err.path[0] as keyof ISignUpRequest, {
						message: err.message,
					});
				}
			});
			return;
		}
		try {
			const response = await signUp({ ...data, role: RoleEnum.USER }).unwrap();
			console.log(response);
			localStorage.setItem(
				LocaleStorageKeysEnum.ACCESS_TOKEN,
				response.tokens.accessToken,
			);
			localStorage.setItem(
				LocaleStorageKeysEnum.REFRESH_TOKEN,
				response.tokens.refreshToken,
			);

			dispatch(
				userSliceActions.setUser({
					...response.user,
					createdAt: String(response.user.createdAt),
					updatedAt: String(response.user.updatedAt),
				}),
			);
			setSuccessMsg(t('auth.register_success'));
			navigate('/');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='min-h-[70vh] flex items-center justify-center px-2'>
			<div className='relative w-full max-w-md p-8 bg-white border border-gray-100 shadow-xl dark:bg-gray-900 rounded-2xl dark:border-gray-800'>
				<button
					type='button'
					className='absolute text-2xl text-gray-400 transition top-3 right-3 hover:text-gray-700 dark:hover:text-white'
					onClick={() => navigate('/')}
					aria-label={t('auth.close', 'Закрити')}
				>
					×
				</button>
				<h2 className='mb-8 text-3xl font-bold text-center text-gray-900 dark:text-white'>
					{t('header.sign_up')}
				</h2>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
					<div>
						<label className='block mb-2 font-medium text-gray-700 dark:text-gray-300'>
							{t('auth.name')}
						</label>
						<input
							type='text'
							{...register('name', {
								required: t('auth.name') + ' ' + t('auth.register_error'),
							})}
							className='w-full px-4 py-2 transition border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
						/>
						{errors.name && typeof errors.name.message === 'string' && (
							<span className='text-sm text-red-500'>
								{errors.name.message}
							</span>
						)}
					</div>
					<div>
						<label className='block mb-2 font-medium text-gray-700 dark:text-gray-300'>
							{t('auth.email')}
						</label>
						<input
							type='email'
							{...register('email', {
								required: t('auth.email') + ' ' + t('auth.register_error'),
							})}
							className='w-full px-4 py-2 transition border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
						/>
						{errors.email && typeof errors.email.message === 'string' && (
							<span className='text-sm text-red-500'>
								{errors.email.message}
							</span>
						)}
					</div>
					<div>
						<label className='block mb-2 font-medium text-gray-700 dark:text-gray-300'>
							{t('auth.password')}
						</label>
						<input
							type='password'
							{...register('password', {
								required: t('auth.password') + ' ' + t('auth.register_error'),
							})}
							className='w-full px-4 py-2 transition border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
						/>
						{errors.password && typeof errors.password.message === 'string' && (
							<span className='text-sm text-red-500'>
								{errors.password.message}
							</span>
						)}
					</div>
					<button
						type='submit'
						className='w-full py-3 text-lg font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700'
						disabled={isLoading}
					>
						{t('auth.sign_up')}
					</button>
				</form>
				{isLoading && (
					<div className='mt-4 text-blue-500'>
						{t('auth.register_success')}...
					</div>
				)}
				{isError && (
					<div className='mt-4 text-red-500'>{t('auth.register_error')}</div>
				)}
				{isSuccess && <div className='mt-4 text-green-600'>{successMsg}</div>}
			</div>
		</div>
	);
};

export default SignUpPage;
