import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
	const { t } = useTranslation();
	return (
		<div className='min-h-[70vh] flex flex-col items-center justify-center px-2 text-center'>
			<div className='mb-4 select-none text-7xl'>🚫</div>
			<h1 className='mb-2 text-4xl font-bold text-gray-900 dark:text-white'>
				{t('not_found.title')}
			</h1>
			<p className='mb-6 text-lg text-gray-600 dark:text-gray-300'>
				{t('not_found.message')}
			</p>
			<Link
				to='/'
				className='inline-block px-6 py-2 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700'
			>
				{t('not_found.to_home')}
			</Link>
		</div>
	);
};

export default NotFoundPage;
