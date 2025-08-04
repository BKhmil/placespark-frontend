import type { TFunction } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/rtk';
import { useAddViewMutation, useGetByIdQuery } from '../../redux/api/placeApi';
import {
	useAddFavoriteMutation,
	useRemoveFavoriteMutation,
} from '../../redux/api/userApi';
import { userSliceActions } from '../../redux/slices/userSlice';

const ContactManagerModal = ({
	open,
	onClose,
	t,
}: {
	open: boolean;
	onClose: () => void;
	t: TFunction;
}) => {
	if (!open) return null;
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
			<div className='relative w-full max-w-md p-6 bg-white shadow-xl dark:bg-gray-900 rounded-xl'>
				<button
					onClick={onClose}
					className='absolute text-2xl text-gray-400 top-3 right-3 hover:text-gray-700 dark:hover:text-gray-200'
					aria-label={t('places.close', 'Закрити')}
				>
					&times;
				</button>
				<h2 className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>
					{t('places.write_manager', 'Написати менеджеру')}
				</h2>
				<form className='flex flex-col gap-2'>
					<input
						type='text'
						placeholder={t('places.your_name', 'Ваше імʼя')}
						className='px-3 py-2 bg-white border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800'
						disabled
					/>
					<input
						type='email'
						placeholder={t('places.your_email', 'Ваш email')}
						className='px-3 py-2 bg-white border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800'
						disabled
					/>
					<textarea
						placeholder={t('places.your_message', 'Ваше повідомлення')}
						className='px-3 py-2 bg-white border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800'
						rows={3}
						disabled
					/>
					<button
						type='button'
						className='px-4 py-2 mt-2 text-white bg-blue-600 rounded cursor-not-allowed opacity-60'
						disabled
					>
						{t('places.send_message', 'Відправити')}
					</button>
					<div className='mt-1 text-xs text-gray-400'>
						{t(
							'places.message_stub',
							'Форма неактивна. Відправка листа не реалізована.',
						)}
					</div>
				</form>
			</div>
		</div>
	);
};

const PlacePage = () => {
	const { t } = useTranslation();
	const { placeId } = useParams<{ placeId: string }>();
	const navigate = useNavigate();
	const { data: place, isLoading, isError } = useGetByIdQuery(placeId || '');
	const isAuthenticated = !!useAppSelector((state) => state.user.user);
	const user = useAppSelector((state) => state.user.user);
	const dispatch = useAppDispatch();
	const [addFavorite, { isLoading: isAdding }] = useAddFavoriteMutation();
	const [removeFavorite, { isLoading: isRemoving }] =
		useRemoveFavoriteMutation();
	const isFavorite = user?.favorites?.includes(place?._id || '');
	const handleFavorite = async () => {
		if (!user || !place?._id) return;
		if (isFavorite) {
			const updated = await removeFavorite({ placeId: place._id }).unwrap();
			dispatch(userSliceActions.setUser(updated));
		} else {
			const updated = await addFavorite({ placeId: place._id }).unwrap();
			dispatch(userSliceActions.setUser(updated));
		}
	};
	const [modalOpen, setModalOpen] = useState(false);
	const canFavorite = user && (user.role === 'user' || user.role === 'critic');
	const [addView] = useAddViewMutation();

	// Фіксація перегляду тільки для user та critic
	useEffect(() => {
		if (user && (user.role === 'user' || user.role === 'critic') && placeId) {
			addView(placeId).catch(() => {});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, placeId]);

	const handleTagClick = (tag: string) => {
		navigate(`/places?tags=${encodeURIComponent(tag)}&page=1&limit=12`);
	};

	if (isLoading) {
		return (
			<div className='py-10 text-center text-gray-500 dark:text-gray-300'>
				{t('places.loading', 'Завантаження...')}
			</div>
		);
	}
	if (isError || !place) {
		return (
			<div className='py-10 text-center text-red-500'>
				{t('places.error', 'Не вдалося завантажити заклад.')}
			</div>
		);
	}

	return (
		<div className='max-w-3xl p-4 mx-auto mt-6 bg-white shadow place-page-container sm:p-8 dark:bg-gray-900 rounded-xl'>
			<ContactManagerModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				t={t}
			/>
			<div className='flex flex-col gap-8 md:flex-row'>
				{/* Фото */}
				<div className='flex items-center justify-center flex-shrink-0 w-full h-56 overflow-hidden bg-gray-200 md:w-72 md:h-72 dark:bg-gray-800 rounded-xl'>
					{place.photo ? (
						<img
							src={place.photo}
							alt={place.name}
							className='object-cover w-full h-full'
						/>
					) : (
						<span className='text-6xl'>🏠</span>
					)}
				</div>
				{/* Основна інформація */}
				<div className='flex flex-col flex-1 gap-3'>
					<h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
						{place.name}
					</h1>
					{canFavorite && (
						<button
							onClick={handleFavorite}
							disabled={isAdding || isRemoving}
							className={`px-4 py-2 mb-2 rounded-lg text-sm font-semibold transition self-start ${
								isFavorite
									? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200'
									: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
							} hover:opacity-80`}
						>
							{isFavorite
								? t('establishments.remove_favorite', 'Видалити з улюблених')
								: t('establishments.add_favorite', 'Додати в улюблені')}
						</button>
					)}
					<div className='text-gray-500 dark:text-gray-300'>
						{place.address}
					</div>
					{/* Розташування */}
					<div className='text-sm text-gray-400'>
						{t('places.location', 'Розташування')}: {place.location.lng},{' '}
						{place.location.lat}
					</div>
					{/* Графік роботи */}
					{place.workingHours && place.workingHours.length > 0 && (
						<div>
							<div className='mb-1 font-semibold text-gray-700 dark:text-gray-200'>
								{t('places.working_hours', 'Графік роботи')}:
							</div>
							<ul className='text-sm text-gray-500 dark:text-gray-300'>
								{place.workingHours.map((wh, idx) => (
									<li key={idx}>
										{t(`working_days.${wh.day}`, wh.day)}:{' '}
										{wh.closed
											? t('places.closed', 'вихідний')
											: `${wh.from || '--'} - ${wh.to || '--'}`}
									</li>
								))}
							</ul>
						</div>
					)}
					{/* Середній чек */}
					<div className='text-sm text-gray-500 dark:text-gray-300'>
						{t('places.average_check', 'Середній чек')}:{' '}
						<span className='font-semibold'>{place.averageCheck} ₴</span>
					</div>
					{/* Теги */}
					{place.tags && place.tags.length > 0 && (
						<div className='flex flex-wrap gap-2 mt-2'>
							{place.tags.map((tag) => (
								<span
									key={tag}
									className='px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded text-xs cursor-pointer hover:underline hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-100'
									onClick={() => handleTagClick(tag)}
									title={
										t(
											'places.filter_by_tag',
											'Показати заклади з цим тегом',
										) as string
									}
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</div>
			</div>
			{/* Контакти та кнопка */}
			<div className='grid grid-cols-1 gap-8 mt-8 md:grid-cols-2'>
				<div>
					<div className='mb-2 font-semibold text-gray-700 dark:text-gray-200'>
						{t('places.contacts', 'Контакти')}
					</div>
					<ul className='text-sm text-gray-500 dark:text-gray-300'>
						{place.contacts?.phone && (
							<li>
								{t('places.phone', 'Телефон')}: {place.contacts.phone}
							</li>
						)}
						{place.contacts?.tg && <li>Telegram: {place.contacts.tg}</li>}
						{place.contacts?.email && <li>Email: {place.contacts.email}</li>}
					</ul>
				</div>
				{/* Кнопка для відкриття модалки */}
				<div className='flex flex-col items-start justify-center'>
					<button
						type='button'
						className='px-4 py-2 mt-2 text-white transition bg-blue-600 rounded hover:bg-blue-700'
						onClick={() => setModalOpen(true)}
					>
						{t('places.write_manager', 'Написати менеджеру')}
					</button>
				</div>
			</div>
			{/* Статистика переглядів (тільки для авторизованих) */}
			{isAuthenticated && typeof place.viewsCount === 'number' && (
				<div className='mt-8'>
					<div className='mb-2 font-semibold text-gray-700 dark:text-gray-200'>
						{t('places.views', 'Перегляди')}
					</div>
					<div className='text-sm text-gray-500 dark:text-gray-300'>
						{t('places.views_count', 'Всього переглядів')}: {place.viewsCount}
					</div>
				</div>
			)}
		</div>
	);
};

export default PlacePage;
