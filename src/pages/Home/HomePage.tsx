import { useTranslation } from 'react-i18next';

const HomePage = () => {
	const { t } = useTranslation();
	return (
		<div className='home-page-container min-h-[60vh] flex flex-col items-center justify-center text-center'>
			<h1 className='text-4xl font-bold mb-6 text-gray-900 dark:text-white'>
				{t('home.welcome', 'Ласкаво просимо до PlaceSpark!')}
			</h1>
			<p className='text-lg text-gray-600 dark:text-gray-300 mb-6'>
				{t(
					'home.find',
					'Знаходь, фільтруй, оцінюй та додавай улюблені заклади.',
				)}
			</p>
		</div>
	);
};

export default HomePage;
