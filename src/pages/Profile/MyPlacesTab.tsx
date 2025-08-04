import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PAGE_SIZE } from '../../constants/pagination.constants';
import { OrderEnum, PlaceListOrderEnum } from '../../enums/place.enums';
import type { IPlace } from '../../interfaces/place.interface';
import { useGetMyEstablishmentsQuery } from '../../redux/api/userApi';
import MyPlaceCardWrapper from './MyPlaceCardWrapper';

const MyPlacesTab = () => {
	const { t } = useTranslation();
	const {
		data: placesResponse,
		isLoading,
		error,
		refetch,
	} = useGetMyEstablishmentsQuery({
		page: 1,
		limit: PAGE_SIZE,
		orderBy: PlaceListOrderEnum.CREATED_AT,
		order: OrderEnum.DESC,
	});

	useEffect(() => {
		refetch();
	}, []);
	console.log(placesResponse);

	if (isLoading) {
		return (
			<div className='text-center text-gray-500 dark:text-gray-400'>
				{t('common.loading', 'Завантаження...')}
			</div>
		);
	}
	if (error) {
		return (
			<div className='text-center text-red-500'>
				{t('common.error', 'Сталася помилка при завантаженні закладів')}
			</div>
		);
	}
	if (!placesResponse || placesResponse.data.length === 0) {
		return (
			<div className='text-center text-gray-500 dark:text-gray-400'>
				{t('profile.no_places', 'У вас немає власних закладів.')}
			</div>
		);
	}
	return (
		<div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-12 mx-0 min-h-[70vh] px-2 sm:px-4 md:px-8 items-stretch'>
			{placesResponse.data.map((place: IPlace) => (
				<MyPlaceCardWrapper key={place._id} place={place} refetch={refetch} />
			))}
		</div>
	);
};

export default MyPlacesTab;
