import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/rtk';
import { useVerifyEmailMutation } from '../../redux/api/authApi';
import { userSliceActions } from '../../redux/slices/userSlice';

const VerifyEmailPage = () => {
	const [searchParams] = useSearchParams();
	const { t } = useTranslation();
	const [verifyEmail, { isLoading, isSuccess, isError }] =
		useVerifyEmailMutation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const token = searchParams.get('token');

	useEffect(() => {
		if (!token) return;
		verifyEmail({ token })
			.unwrap()
			.then(() => {
				const userStr = localStorage.getItem('user');
				if (userStr) {
					try {
						const user = JSON.parse(userStr);
						const updatedUser = { ...user, isVerified: true };
						localStorage.setItem('user', JSON.stringify(updatedUser));
						dispatch(userSliceActions.setUser(updatedUser));
					} catch {
						// ignore error
					}
				}
			});
	}, [token]);

	let content;
	if (!token) {
		content = (
			<div className='text-lg font-bold text-red-500'>
				{t('auth.verify_email_no_token')}
			</div>
		);
	} else if (isLoading) {
		content = (
			<div className='text-lg text-blue-500'>
				{t('auth.verify_email_pending')}
			</div>
		);
	} else if (isSuccess) {
		content = (
			<>
				<div className='mb-4 text-lg font-bold text-green-600'>
					{t('auth.verify_email_success')}
				</div>
				<button
					type='button'
					className='px-6 py-2 mt-2 text-white transition bg-blue-600 rounded hover:bg-blue-700'
					onClick={() => navigate('/')}
				>
					{t('auth.go_home', 'На головну')}
				</button>
			</>
		);
	} else if (isError) {
		content = (
			<div className='text-lg font-bold text-red-500'>
				{t('auth.verify_email_error')}
			</div>
		);
	}

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950'>
			<div className='w-full max-w-md p-8 text-center bg-white shadow dark:bg-gray-900 rounded-xl'>
				{content}
			</div>
		</div>
	);
};

export default VerifyEmailPage;
