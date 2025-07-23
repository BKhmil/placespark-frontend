import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
	const { t } = useTranslation();
	return (
		<div className='min-h-[60vh] flex flex-col items-center justify-center text-center'>
			<h1 className='text-3xl font-bold mb-4 text-gray-900 dark:text-white'>
				{t('profile.title', 'Personal Cabinet')}
			</h1>
			<p className='text-lg text-gray-600 dark:text-gray-300 mb-6'>
				{t('profile.description', 'Here will be your personal cabinet.')}
			</p>
		</div>
	);
};

export default ProfilePage;
