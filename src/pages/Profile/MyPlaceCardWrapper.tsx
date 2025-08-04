import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EstablishmentCard from '../../components/EstablishmentCard';
import { useAppDispatch } from '../../hooks/rtk';
import type { IPlace } from '../../interfaces/place.interface';
import { useDeletePlaceMutation } from '../../redux/api/placeApi';
import { userSliceActions } from '../../redux/slices/userSlice';

const MyPlaceCardWrapper = ({
	place,
	refetch,
}: {
	place: IPlace;
	refetch: () => void;
}) => {
	console.log(place);
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [deletePlace] = useDeletePlaceMutation();
	const dispatch = useAppDispatch();
	if (!place) return null;
	const isInactive = place.isModerated === false;

	return (
		<div className='flex flex-col items-center'>
			<div
				className={
					isInactive
						? 'block w-full cursor-not-allowed select-none group opacity-60'
						: 'block w-full group'
				}
			>
				<EstablishmentCard place={place} t={t} isInactive={isInactive} />
			</div>
			{isInactive && (
				<div className='mt-2 text-xs font-semibold text-orange-500'>
					{t('profile.place_pending', 'Очікує модерації')}
				</div>
			)}
			<div className='flex gap-2 mt-3'>
				<button
					type='button'
					className='px-3 py-1 text-white transition bg-yellow-500 rounded hover:bg-yellow-600'
					onClick={() => navigate(`/profile/edit-place/${place._id}`)}
				>
					{t('profile.edit_place', 'Редагувати')}
				</button>
				<button
					type='button'
					className='px-3 py-1 text-white transition bg-red-500 rounded hover:bg-red-600'
					onClick={() => setDeleteId(place._id)}
				>
					{t('profile.delete_place', 'Видалити')}
				</button>
			</div>
			{/* Модалка підтвердження видалення */}
			{deleteId && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
					<div className='bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl min-w-[320px]'>
						<div className='mb-4 font-bold'>
							{t(
								'profile.delete_place_confirm',
								'Ви впевнені, що хочете видалити цей заклад?',
							)}
						</div>
						<div className='flex gap-4'>
							<button
								type='button'
								className='btn btn-danger'
								onClick={async () => {
									await deletePlace(deleteId);
									if (refetch) refetch();
									dispatch(userSliceActions.removeAdminEstablishment(deleteId));
									setDeleteId(null);
								}}
							>
								{t('common.delete', 'Видалити')}
							</button>
							<button
								type='button'
								className='btn btn-secondary'
								onClick={() => setDeleteId(null)}
							>
								{t('common.cancel', 'Скасувати')}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MyPlaceCardWrapper;
