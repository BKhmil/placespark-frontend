import { useTranslation } from 'react-i18next';
import EstablishmentsListSection from '../Home/EstablishmentsListSection';

const PlacesPage = () => {
	const { t } = useTranslation();
	return (
		<div className='places-page-container'>
			<h1 className='text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white'>
				{t('places.title', 'Каталог закладів')}
			</h1>
			<EstablishmentsListSection />
		</div>
	);
};

export default PlacesPage;
