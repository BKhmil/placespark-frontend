import { useTranslation } from 'react-i18next';
import EstablishmentsListSection from './EstablishmentsListSection';

const NewsList = () => (
	<div className='grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-3'>
		{[1, 2, 3].map((i) => (
			<div
				key={i}
				className='flex flex-col p-4 bg-gray-100 rounded-lg shadow dark:bg-gray-900'
			>
				<div className='mb-2 text-lg font-bold'>News {i}</div>
				<div className='mb-2 text-sm text-gray-600 dark:text-gray-300'>
					Short news description...
				</div>
				<button
					type='button'
					className='self-end px-3 py-1 text-sm text-white transition bg-blue-500 rounded hover:bg-blue-600'
				>
					Read more
				</button>
			</div>
		))}
	</div>
);

const HomePage = () => {
	const { t } = useTranslation();
	return (
		<div className='space-y-12'>
			<section className='py-4 text-center md:py-8'>
				<h1 className='mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl dark:text-white'>
					{t('home.welcome')}
				</h1>
				<p className='max-w-2xl mx-auto mb-6 text-lg text-gray-600 md:text-xl dark:text-gray-300'>
					{t('home.find')}
				</p>
			</section>

			<EstablishmentsListSection />

			<section>
				<h2 className='mb-6 text-2xl font-bold text-center text-gray-800 dark:text-gray-100'>
					{t('home.news')}
				</h2>
				<NewsList />
			</section>
		</div>
	);
};

export default HomePage;
