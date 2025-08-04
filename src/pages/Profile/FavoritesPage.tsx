import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import EstablishmentCard from '../../components/EstablishmentCard';
import { useGetFavoritesQuery } from '../../redux/api/userApi';

const FavoritesPage = () => {
	const { t } = useTranslation();
	const { data: favorites, isLoading, error, refetch } = useGetFavoritesQuery();

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
				{t('common.error', 'Помилка завантаження улюблених закладів')}
			</div>
		);
	}

	if (!favorites || favorites.length === 0) {
		return (
			<div className='text-center text-gray-500 dark:text-gray-400'>
				<p className='mb-4'>
					{t('profile.no_favorites', 'У вас поки немає улюблених закладів')}
				</p>
				<Link
					to='/places'
					className='px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700'
				>
					{t('profile.browse_places', 'Переглянути заклади')}
				</Link>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
				{t('profile.favorites_title', 'Улюблені заклади')} ({favorites.length})
			</h2>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
				{favorites.map((place) => (
					<EstablishmentCard
						key={place._id}
						place={place}
						t={t}
						onFavoriteChange={() => {
							// Оновлюємо список після зміни улюблених
							refetch();
						}}
					/>
				))}
			</div>
		</div>
	);
};

export default FavoritesPage;
