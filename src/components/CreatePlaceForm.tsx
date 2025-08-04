import { joiResolver } from '@hookform/resolvers/joi';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {
	featureOptions,
	typeOptions,
} from '../constants/establishments.constants';
import { PlaceWorkingDayEnum } from '../enums/place-working-day.enum';
import { PlaceTypeEnum, type PlaceFeatureEnum } from '../enums/place.enums';
import { useAppDispatch, useAppSelector } from '../hooks/rtk';
import type { IWorkingHour } from '../interfaces/place.interface';
import { useCreatePlaceMutation } from '../redux/api/placeApi';
import { userSliceActions } from '../redux/slices/userSlice';
import { PlaceValidator } from '../validators/place.validator';

export interface ICreatePlaceFormInput {
	name: string;
	description?: string;
	address: string;
	location: { lat: number; lng: number };
	tags?: string[];
	type: PlaceTypeEnum;
	features?: PlaceFeatureEnum[];
	averageCheck?: number;
	contacts?: {
		phone?: string;
		tg?: string;
		email?: string;
	};
	workingHours?: Array<{
		day: string;
		from?: string;
		to?: string;
		closed?: boolean;
	}>;
}

const defaultValues: ICreatePlaceFormInput = {
	name: '',
	description: '',
	address: '',
	location: { lat: 0, lng: 0 },
	tags: [],
	type: PlaceTypeEnum.RESTAURANT,
	features: [],
	averageCheck: undefined,
	contacts: { phone: '', tg: '', email: '' },
	workingHours: Object.values(PlaceWorkingDayEnum).map((day) => ({
		day,
		closed: false,
	})),
};

const isApiError = (e: unknown): e is { data: { message: string } } => {
	if (typeof e === 'object' && e !== null && 'data' in e) {
		const data = (e as { data?: unknown }).data;
		if (
			data &&
			typeof data === 'object' &&
			'message' in data &&
			typeof (data as { message?: unknown }).message === 'string'
		) {
			return true;
		}
	}
	return false;
};

const CreatePlaceForm = () => {
	const { t } = useTranslation();
	const [createPlace, { isLoading, isSuccess }] = useCreatePlaceMutation();
	const [submitError, setSubmitError] = useState<string | null>(null);
	const { user } = useAppSelector((state) => state.user);
	const dispatch = useAppDispatch();
	const {
		handleSubmit,
		register,
		formState: { errors },
		reset,
		control,
	} = useForm<ICreatePlaceFormInput>({
		defaultValues,
		resolver: joiResolver(PlaceValidator.create),
	});

	const onSubmit = async (data: ICreatePlaceFormInput) => {
		console.log('onSubmit', data);
		setSubmitError(null);
		try {
			const workingHours: IWorkingHour[] = Object.values(
				PlaceWorkingDayEnum,
			).map((day, idx) => {
				const wh = (data.workingHours?.[idx] || {}) as Partial<IWorkingHour>;
				return {
					day,
					closed: !!wh.closed,
					from: wh.from,
					to: wh.to,
				};
			});
			console.log('workingHours to send', workingHours);
			const created = await createPlace({
				...data,
				workingHours,
				createdBy: user?._id,
			}).unwrap();
			dispatch(userSliceActions.addAdminEstablishment(created._id));
			reset();
		} catch (e: unknown) {
			if (isApiError(e)) {
				setSubmitError(e.data.message);
			} else {
				setSubmitError('Помилка створення закладу');
			}
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='flex flex-col max-w-lg gap-4 mx-auto'
		>
			{Object.keys(errors).length > 0 && (
				<pre className='text-xs text-red-500'>
					{JSON.stringify(errors, null, 2)}
				</pre>
			)}
			<label className='flex flex-col gap-1'>
				{t('place.name', 'Назва')}
				<input
					{...register('name')}
					className='px-3 py-2 transition-colors border border-gray-400 rounded input focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600'
				/>
				{errors.name?.message && (
					<div className='text-red-500'>{t(errors.name.message!)}</div>
				)}
			</label>
			<label className='flex flex-col gap-1'>
				{t('place.description', 'Опис')}
				<textarea
					{...register('description')}
					className='px-3 py-2 transition-colors border border-gray-400 rounded input focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600'
				/>
				{errors.description?.message && (
					<div className='text-red-500'>{t(errors.description.message!)}</div>
				)}
			</label>
			<label className='flex flex-col gap-1'>
				{t('place.address', 'Адреса')}
				<input
					{...register('address')}
					className='px-3 py-2 transition-colors border border-gray-400 rounded input focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600'
				/>
				{errors.address?.message && (
					<div className='text-red-500'>{t(errors.address.message!)}</div>
				)}
			</label>
			<div className='flex gap-2'>
				<label className='flex flex-col flex-1 gap-1'>
					{t('place.location_lat', 'Широта (lat)')}
					<input
						type='number'
						step='any'
						{...register('location.lat')}
						className='px-3 py-2 transition-colors border border-gray-400 rounded input focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600'
					/>
					{errors.location?.lat?.message && (
						<div className='text-red-500'>
							{t(errors.location.lat.message!)}
						</div>
					)}
				</label>
				<label className='flex flex-col flex-1 gap-1'>
					{t('place.location_lng', 'Довгота (lng)')}
					<input
						type='number'
						step='any'
						{...register('location.lng')}
						className='px-3 py-2 transition-colors border border-gray-400 rounded input focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600'
					/>
					{errors.location?.lng?.message && (
						<div className='text-red-500'>
							{t(errors.location.lng.message!)}
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
								typeOptions.find((option) => option.value === field.value) ||
								null
							}
							onChange={(option) => field.onChange(option ? option.value : '')}
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
					<div className='text-red-500'>{t(errors.features.message!)}</div>
				)}
			</label>
			<label className='flex flex-col gap-1'>
				{t('place.averageCheck', 'Середній чек')}
				<input
					type='number'
					{...register('averageCheck')}
					className='px-3 py-2 transition-colors border border-gray-400 rounded input focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600'
				/>
				{errors.averageCheck?.message && (
					<div className='text-red-500'>{t(errors.averageCheck.message!)}</div>
				)}
			</label>
			<label className='flex flex-col gap-1'>
				{t('place.contacts_phone', 'Телефон')}
				<input
					{...register('contacts.phone')}
					className='px-3 py-2 transition-colors border border-gray-400 rounded input focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600'
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
					className='px-3 py-2 transition-colors border border-gray-400 rounded input focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600'
				/>
				{errors.contacts?.tg?.message && (
					<div className='text-red-500'>{t(errors.contacts.tg.message!)}</div>
				)}
			</label>
			<label className='flex flex-col gap-1'>
				{t('place.contacts_email', 'Email')}
				<input
					{...register('contacts.email')}
					className='px-3 py-2 transition-colors border border-gray-400 rounded input focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600'
				/>
				{errors.contacts?.email?.message && (
					<div className='text-red-500'>
						{t(errors.contacts.email.message!)}
					</div>
				)}
			</label>
			<div className='flex flex-col gap-2'>
				<span className='font-semibold'>
					{t('place.working_hours', 'Графік роботи')}
				</span>
				{Object.values(PlaceWorkingDayEnum).map((day, idx) => (
					<Controller
						key={day}
						name={`workingHours.${idx}`}
						control={control}
						render={({ field }) => (
							<div className='flex items-center gap-2'>
								<span className='w-24 capitalize'>{t(`days.${day}`, day)}</span>
								<input
									type='time'
									className='w-24 px-2 py-1 border border-gray-400 rounded input dark:bg-gray-800 dark:text-white dark:border-gray-600'
									value={field.value?.from || ''}
									disabled={field.value?.closed}
									onChange={(e) =>
										field.onChange({ ...field.value, from: e.target.value })
									}
									required={!field.value?.closed}
									placeholder='09:00'
								/>
								<span>-</span>
								<input
									type='time'
									className='w-24 px-2 py-1 border border-gray-400 rounded input dark:bg-gray-800 dark:text-white dark:border-gray-600'
									value={field.value?.to || ''}
									disabled={field.value?.closed}
									onChange={(e) =>
										field.onChange({ ...field.value, to: e.target.value })
									}
									required={!field.value?.closed}
									placeholder='18:00'
								/>
								<label className='flex items-center gap-1 ml-2'>
									<input
										type='checkbox'
										checked={!!field.value?.closed}
										onChange={(e) => {
											const checked = e.target.checked;
											field.onChange({
												...field.value,
												closed: checked,
												from: checked ? '' : field.value?.from,
												to: checked ? '' : field.value?.to,
											});
										}}
									/>
									{t('place.closed', 'Вихідний')}
								</label>
							</div>
						)}
					/>
				))}
			</div>
			<button type='submit' className='btn btn-primary' disabled={isLoading}>
				{t('place.create', 'Створити')}
			</button>
			{submitError && <div className='text-red-500'>{submitError}</div>}
			{isSuccess && (
				<div className='text-green-600'>
					{t('place.create_success', 'Заклад створено!')}
				</div>
			)}
		</form>
	);
};

export default CreatePlaceForm;
