import { type TFunction } from 'i18next';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/rtk';
import { type IPlace } from '../interfaces/place.interface';
import {
	useAddFavoriteMutation,
	useGetFavoritesQuery,
	useRemoveFavoriteMutation,
} from '../redux/api/userApi';
import { userSliceActions } from '../redux/slices/userSlice';

interface IEstablishmentCardProps {
	place: IPlace;
	t: TFunction;
	isInactive?: boolean;
	onFavoriteChange?: () => void;
}

const EstablishmentCard: React.FC<IEstablishmentCardProps> = ({
	place,
	t,
	isInactive,
	onFavoriteChange,
}) => {
	const user = useAppSelector((state) => state.user.user);
	const dispatch = useAppDispatch();
	const [addFavorite, { isLoading: isAdding }] = useAddFavoriteMutation();
	const [removeFavorite, { isLoading: isRemoving }] =
		useRemoveFavoriteMutation();
	const { refetch: refetchFavorites } = useGetFavoritesQuery();
	const isFavorite = user?.favorites?.includes(place._id);
	const handleFavorite = async () => {
		if (!user) return;
		if (isFavorite) {
			const updated = await removeFavorite({ placeId: place._id }).unwrap();
			dispatch(userSliceActions.setUser(updated));
			if (onFavoriteChange) {
				onFavoriteChange();
			} else {
				refetchFavorites();
			}
		} else {
			const updated = await addFavorite({ placeId: place._id }).unwrap();
			dispatch(userSliceActions.setUser(updated));
			if (onFavoriteChange) {
				onFavoriteChange();
			} else {
				refetchFavorites();
			}
		}
	};
	const canFavorite = user && (user.role === 'user' || user.role === 'critic');

	return (
		<div className='relative flex flex-col justify-between w-[300px] h-[400px] max-h-[400px] bg-white border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-transform duration-150 overflow-hidden group'>
			{canFavorite && (
				<button
					onClick={handleFavorite}
					disabled={isAdding || isRemoving}
					className={`absolute top-2 left-2 z-10 p-1.5 rounded-full transition ${
						isFavorite
							? 'bg-red-500 text-white'
							: 'bg-white/80 text-gray-400 hover:text-red-500'
					} hover:scale-110`}
				>
					{isFavorite ? '❤️' : '🤍'}
				</button>
			)}
			<div>
				<div className='flex items-center justify-center w-28 h-28 mb-6 text-3xl text-gray-400 bg-gray-200 rounded-full dark:bg-gray-700 mx-auto overflow-hidden'>
					{place.photo ? (
						<img
							src={place.photo}
							alt={place.name}
							className='object-cover w-full h-full rounded-full transition-transform duration-150 group-hover:scale-110'
						/>
					) : (
						'🏠'
					)}
				</div>
				<div className='mb-2 text-xl font-bold text-center text-gray-900 dark:text-white'>
					{place.name}
				</div>
				<div className='mb-2 text-sm text-center text-gray-500 dark:text-gray-400'>
					{place.address}
				</div>
				<div className='mb-3 text-xs text-center text-gray-400'>
					{t(`establishments.type.${place.type}`, place.type)}
				</div>
				<div className='flex flex-wrap justify-center gap-2 mb-4'>
					{place.features.map((f: string) => (
						<span
							key={f}
							className='px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded text-xs'
						>
							{t(`establishments.feature.${f}`, f)}
						</span>
					))}
				</div>
				<div className='flex items-center justify-center gap-1 mb-6 text-base font-semibold text-yellow-500'>
					<span>★</span>
					<span>{place.rating.toFixed(1)}</span>
				</div>
			</div>
			{isInactive ? (
				<button
					className='px-6 py-3 mt-2 text-base font-semibold text-white bg-gray-400 rounded-lg text-center block cursor-not-allowed opacity-60'
					disabled
					type='button'
				>
					{t('establishments.details', 'Детальніше')}
				</button>
			) : (
				<Link
					to={`/places/${place._id}`}
					className='px-6 py-3 mt-2 text-base font-semibold text-white transition bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 text-center block'
				>
					{t('establishments.details', 'Детальніше')}
				</Link>
			)}
		</div>
	);
};

export default EstablishmentCard;
