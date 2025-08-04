import { joiResolver } from '@hookform/resolvers/joi';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import type { ICreatePlaceFormInput } from '../../components/CreatePlaceForm';
import {
	featureOptions,
	typeOptions,
} from '../../constants/establishments.constants';
import {
	useGetByIdQuery,
	useUpdatePhotoMutation,
	useUpdatePlaceMutation,
} from '../../redux/api/placeApi';
import { PlaceValidator } from '../../validators/place.validator';

// Функція для фільтрації пустих полів
const filterEmptyFields = (data: any): any => {
	const filtered: any = {};

	for (const [key, value] of Object.entries(data)) {
		// Пропускаємо null, undefined та пусті рядки
		if (value === null || value === undefined || value === '') {
			continue;
		}

		// Обробляємо масиви
		if (Array.isArray(value)) {
			if (value.length > 0) {
				// Фільтруємо елементи масиву
				const filteredArray = value.filter(
					(item) => item !== null && item !== undefined && item !== '',
				);
				if (filteredArray.length > 0) {
					filtered[key] = filteredArray;
				}
			}
		}
		// Обробляємо об'єкти (але не масиви)
		else if (
			typeof value === 'object' &&
			value !== null &&
			!Array.isArray(value)
		) {
			const filteredNested = filterEmptyFields(value);
			if (Object.keys(filteredNested).length > 0) {
				filtered[key] = filteredNested;
			}
		}
		// Обробляємо примітивні значення
		else {
			filtered[key] = value;
		}
	}

	return filtered;
};

const EditPlacePage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { placeId } = useParams<{ placeId: string }>();
	const [updatePlace, { isLoading }] = useUpdatePlaceMutation();
	const [updatePhoto, { isLoading: isUpdatingPhoto }] =
		useUpdatePhotoMutation();
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [photoError, setPhotoError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isPhotoSuccess, setIsPhotoSuccess] = useState(false);
	const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

	const {
		data: place,
		isLoading: isLoadingPlace,
		error,
	} = useGetByIdQuery(placeId || '');

	const {
		handleSubmit,
		register,
		formState: { errors },
		control,
	} = useForm<ICreatePlaceFormInput>({
		defaultValues: place
			? {
					...place,
					tags: place.tags || [],
					features: (place.features || []).map(
						(f) => f as import('../../enums/place.enums').PlaceFeatureEnum,
					),
					type: place.type as import('../../enums/place.enums').PlaceTypeEnum,
					contacts: place.contacts || { phone: '', tg: '', email: '' },
					location: place.location || { lat: 0, lng: 0 },
			  }
			: undefined,
		resolver: joiResolver(PlaceValidator.update),
	});

	const onSubmit = async (data: ICreatePlaceFormInput) => {
		if (!placeId) return;
		setSubmitError(null);
		try {
			const features = (data.features || []).map(
				(f) => f as import('../../enums/place.enums').PlaceFeatureEnum,
			);
			const type = data.type as import('../../enums/place.enums').PlaceTypeEnum;

			// Фільтруємо пусті поля перед відправкою
			const filteredData = filterEmptyFields({ ...data, features, type });

			await updatePlace({
				id: placeId,
				data: filteredData,
			}).unwrap();
			setIsSuccess(true);
			setTimeout(() => {
				navigate('/profile/my-places');
			}, 2000);
		} catch (e) {
			if (
				typeof e === 'object' &&
				e !== null &&
				'data' in e &&
				typeof (e as { data?: { message?: string } }).data?.message === 'string'
			) {
				setSubmitError((e as { data: { message: string } }).data.message);
			} else {
				setSubmitError('Помилка оновлення');
			}
		}
	};

	const handlePhotoUpload = async () => {
		if (!placeId || !selectedPhoto) return;
		setPhotoError(null);
		try {
			await updatePhoto({ id: placeId, photo: selectedPhoto }).unwrap();
			setIsPhotoSuccess(true);
			setSelectedPhoto(null);
			setTimeout(() => {
				setIsPhotoSuccess(false);
			}, 3000);
		} catch (e) {
			if (
				typeof e === 'object' &&
				e !== null &&
				'data' in e &&
				typeof (e as { data?: { message?: string } }).data?.message === 'string'
			) {
				setPhotoError((e as { data: { message: string } }).data.message);
			} else {
				setPhotoError('Помилка оновлення фото');
			}
		}
	};

	if (isLoadingPlace) {
		return (
			<div className='text-center text-gray-500 dark:text-gray-400'>
				{t('common.loading', 'Завантаження...')}
			</div>
		);
	}

	if (error || !place) {
		return (
			<div className='text-center text-red-500'>
				{t('common.error', 'Не вдалося завантажити заклад')}
			</div>
		);
	}

	return (
		<div className='max-w-4xl mx-auto p-6'>
			<div className='flex items-center justify-between mb-6'>
				<h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
					{t('profile.edit_place_title', 'Редагування закладу')}: {place.name}
				</h1>
				<button
					type='button'
					onClick={() => navigate('/profile/my-places')}
					className='px-4 py-2 text-gray-600 transition bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
				>
					{t('common.back', 'Назад')}
				</button>
			</div>

			{/* Основна форма редагування */}
			<div className='mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg border'>
				<h2 className='mb-4 text-xl font-semibold text-gray-900 dark:text-white'>
					{t('profile.edit_basic_info', 'Основна інформація')}
				</h2>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<label className='flex flex-col gap-1'>
							{t('place.name', 'Назва')}
							<input
								{...register('name')}
								className='input border border-gray-400'
							/>
							{errors.name?.message && (
								<div className='text-red-500'>{t(errors.name.message!)}</div>
							)}
						</label>

						<label className='flex flex-col gap-1'>
							{t('place.address', 'Адреса')}
							<input
								{...register('address')}
								className='input border border-gray-400'
							/>
							{errors.address?.message && (
								<div className='text-red-500'>{t(errors.address.message!)}</div>
							)}
						</label>

						<label className='flex flex-col gap-1'>
							{t('place.location_lat', 'Широта (lat)')}
							<input
								type='number'
								step='any'
								{...register('location.lat')}
								className='input border border-gray-400'
							/>
							{errors.location?.lat?.message && (
								<div className='text-red-500'>
									{t(errors.location.lat.message!)}
								</div>
							)}
						</label>

						<label className='flex flex-col gap-1'>
							{t('place.location_lng', 'Довгота (lng)')}
							<input
								type='number'
								step='any'
								{...register('location.lng')}
								className='input border border-gray-400'
							/>
							{errors.location?.lng?.message && (
								<div className='text-red-500'>
									{t(errors.location.lng.message!)}
								</div>
							)}
						</label>
					</div>

					<label className='flex flex-col gap-1'>
						{t('place.description', 'Опис')}
						<textarea
							{...register('description')}
							className='input min-h-[100px] border border-gray-400'
						/>
						{errors.description?.message && (
							<div className='text-red-500'>
								{t(errors.description.message!)}
							</div>
						)}
					</label>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<label>
							{t('place.type', 'Тип')}
							<Controller
								name='type'
								control={control}
								render={({ field }) => (
									<Select
										{...field}
										options={typeOptions}
										classNamePrefix='react-select'
										value={
											typeOptions.find(
												(option) => option.value === field.value,
											) || null
										}
										onChange={(option) =>
											field.onChange(option ? option.value : '')
										}
										isClearable
									/>
								)}
							/>
							{errors.type?.message && (
								<div className='text-red-500'>{t(errors.type.message!)}</div>
							)}
						</label>

						<label>
							{t('place.features', 'Особливості')}
							<Controller
								name='features'
								control={control}
								render={({ field }) => (
									<Select
										{...field}
										options={featureOptions}
										classNamePrefix='react-select'
										isMulti
										value={featureOptions.filter((option) =>
											field.value?.includes(option.value),
										)}
										onChange={(options) =>
											field.onChange(options ? options.map((o) => o.value) : [])
										}
									/>
								)}
							/>
							{errors.features?.message && (
								<div className='text-red-500'>
									{t(errors.features.message!)}
								</div>
							)}
						</label>
					</div>

					<label>
						{t('place.tags', 'Теги')}
						<Controller
							name='tags'
							control={control}
							render={({ field }) => {
								type OptionType = { value: string; label: string };
								return (
									<CreatableSelect
										isMulti
										value={(field.value || []).map((tag: string) => ({
											value: tag,
											label: tag,
										}))}
										onChange={(options) => {
											const tags = (options as OptionType[] | null)
												? (options as OptionType[]).map((o) => o.value)
												: [];
											field.onChange(tags.slice(0, 4));
										}}
										placeholder={t('place.tags_placeholder', 'Введіть теги...')}
										classNamePrefix='react-select'
										isClearable
									/>
								);
							}}
						/>
						<div className='text-xs text-gray-500'>
							{t('place.tags_limit', 'Максимум 4 теги')}
						</div>
						{errors.tags?.message && (
							<div className='text-red-500'>{t(errors.tags.message!)}</div>
						)}
					</label>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<label className='flex flex-col gap-1'>
							{t('place.contacts_phone', 'Телефон')}
							<input
								{...register('contacts.phone')}
								className='input border border-gray-400'
							/>
							{errors.contacts?.phone?.message && (
								<div className='text-red-500'>
									{t(errors.contacts.phone.message!)}
								</div>
							)}
						</label>

						<label className='flex flex-col gap-1'>
							{t('place.contacts_tg', 'Telegram')}
							<input
								{...register('contacts.tg')}
								className='input border border-gray-400'
							/>
							{errors.contacts?.tg?.message && (
								<div className='text-red-500'>
									{t(errors.contacts.tg.message!)}
								</div>
							)}
						</label>

						<label className='flex flex-col gap-1'>
							{t('place.contacts_email', 'Email')}
							<input
								{...register('contacts.email')}
								className='input border border-gray-400'
							/>
							{errors.contacts?.email?.message && (
								<div className='text-red-500'>
									{t(errors.contacts.email.message!)}
								</div>
							)}
						</label>
					</div>

					<div className='flex gap-4 pt-6 border-t'>
						<button
							type='submit'
							className='btn btn-primary'
							disabled={isLoading}
						>
							{t('place.update', 'Оновити')}
						</button>
						<button
							type='button'
							className='btn btn-secondary'
							onClick={() => navigate('/profile/my-places')}
						>
							{t('common.cancel', 'Скасувати')}
						</button>
					</div>

					{submitError && <div className='text-red-500'>{submitError}</div>}
					{isSuccess && (
						<div className='text-green-600'>
							{t('place.update_success', 'Заклад оновлено! Перенаправлення...')}
						</div>
					)}
				</form>
			</div>

			{/* Форма оновлення фото */}
			<div className='p-6 bg-white dark:bg-gray-800 rounded-lg border'>
				<h2 className='mb-4 text-xl font-semibold text-gray-900 dark:text-white'>
					{t('profile.update_photo', 'Оновлення фото')}
				</h2>
				<div className='flex flex-col gap-4'>
					{/* Форма завантаження */}
					<div className='flex flex-col gap-4'>
						<label className='flex flex-col gap-1'>
							{t('profile.new_photo', 'Нове фото')}
							<input
								type='file'
								accept='image/*'
								onChange={(e) => {
									const file = e.target.files?.[0];
									setSelectedPhoto(file || null);
									setPhotoError(null);
								}}
								className='input border border-gray-400'
							/>
						</label>
						<div className='text-xs text-gray-500'>
							{t('profile.photo_help', 'Оберіть зображення для завантаження')}
						</div>

						{/* Превью вибраного фото */}
						{selectedPhoto && (
							<div className='flex items-center gap-4'>
								<div className='w-32 h-32 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-lg'>
									<img
										src={URL.createObjectURL(selectedPhoto)}
										alt='Preview'
										className='w-full h-full object-cover'
									/>
								</div>
								<div className='flex flex-col gap-2'>
									<span className='text-sm text-gray-600 dark:text-gray-400'>
										{t('profile.selected_photo', 'Вибране фото')}
									</span>
									<span className='text-xs text-gray-500'>
										{selectedPhoto.name}
									</span>
								</div>
							</div>
						)}

						{/* Кнопки */}
						<div className='flex gap-4'>
							<button
								type='button'
								onClick={handlePhotoUpload}
								disabled={!selectedPhoto || isUpdatingPhoto}
								className='btn btn-primary'
							>
								{isUpdatingPhoto
									? t('profile.uploading_photo', 'Завантаження...')
									: t('profile.upload_photo', 'Завантажити фото')}
							</button>
							{selectedPhoto && (
								<button
									type='button'
									onClick={() => setSelectedPhoto(null)}
									className='btn btn-secondary'
								>
									{t('common.cancel', 'Скасувати')}
								</button>
							)}
						</div>
					</div>

					{photoError && <div className='text-red-500'>{photoError}</div>}
					{isPhotoSuccess && (
						<div className='text-green-600'>
							{t('profile.photo_updated', 'Фото оновлено!')}
						</div>
					)}
					{isUpdatingPhoto && (
						<div className='text-blue-500'>
							{t('profile.uploading_photo', 'Завантаження фото...')}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default EditPlacePage;
