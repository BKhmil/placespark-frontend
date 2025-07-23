import { type TFunction } from 'i18next';
import { type FC } from 'react';
import {
	type Control,
	type UseFormHandleSubmit,
	Controller,
} from 'react-hook-form';
import Select from 'react-select';
import { type IEstablishmentsFilterForm } from '../pages/Home/EstablishmentsListSection';
import { placeApi } from '../redux/api/placeApi';

export interface IOption {
	value: string;
	label: string;
}

interface IEstablishmentsFilterFormProps {
	control: Control<IEstablishmentsFilterForm>;
	handleSubmit: UseFormHandleSubmit<IEstablishmentsFilterForm>;
	onSubmit: (data: IEstablishmentsFilterForm) => void;
	onReset: () => void;
	geoError: string | null;
	isApplyDisabled: boolean;
	options: {
		typeOptions: IOption[];
		featureOptions: IOption[];
		orderByOptions: IOption[];
		orderOptions: IOption[];
	};
	t: TFunction;
}

const EstablishmentsFilterForm: FC<IEstablishmentsFilterFormProps> = ({
	control,
	handleSubmit,
	onSubmit,
	onReset,
	geoError,
	isApplyDisabled,
	options,
	t,
}) => {
	const { data, isLoading } = placeApi.useGetTagsQuery();

	if (isLoading) return <div>Loading...</div>;

	const tagOptions =
		data?.tags.map((tag) => ({ value: tag, label: tag })) ?? [];

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className='mb-4 filter-group'>
				<label
					htmlFor='est-name'
					className='mb-1 text-gray-900 dark:text-gray-200'
				>
					{t('establishments.search_placeholder')}
				</label>
				<Controller
					name='name'
					control={control}
					render={({ field }) => (
						<input
							{...field}
							id='est-name'
							placeholder={t(
								'establishments.search_placeholder',
								'Search by name...',
							)}
							className='w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400'
						/>
					)}
				/>
			</div>

			<div className='mb-4 filter-group'>
				<label
					htmlFor='est-type'
					className='mb-1 text-gray-900 dark:text-gray-200'
				>
					{t('establishments.type_all')}
				</label>
				<Controller
					name='type'
					control={control}
					render={({ field }) => (
						<Select
							options={options.typeOptions}
							value={
								options.typeOptions.find((opt) => opt.value === field.value) ||
								null
							}
							onChange={(opt) => field.onChange(opt ? opt.value : '')}
							placeholder={t('establishments.type_all', 'All types')}
							className='mt-2'
							classNamePrefix='react-select'
							isClearable
							getOptionLabel={(opt) =>
								t(`establishments.type.${opt.value}`, opt.label)
							}
						/>
					)}
				/>
			</div>

			<div className='mb-4 filter-group'>
				<label className='mb-1 text-gray-900 dark:text-gray-200'>
					{t('filters.features', 'Features')}
				</label>
				<div className='features-list max-h-[220px] overflow-y-auto pr-2'>
					<Controller
						name='features'
						control={control}
						render={({ field }) => (
							<>
								{options.featureOptions.map((opt) => (
									<div key={opt.value} className='flex items-center gap-2 mb-2'>
										<input
											type='checkbox'
											id={`feature-${opt.value}`}
											checked={field.value.includes(opt.value)}
											onChange={() => {
												if (field.value.includes(opt.value)) {
													field.onChange(
														field.value.filter((v: string) => v !== opt.value),
													);
												} else {
													field.onChange([...field.value, opt.value]);
												}
											}}
											className='accent-blue-600 dark:accent-blue-400'
										/>
										<label
											htmlFor={`feature-${opt.value}`}
											className='text-gray-900 dark:text-gray-200'
										>
											{t(`establishments.feature.${opt.value}`, opt.label)}
										</label>
									</div>
								))}
							</>
						)}
					/>
				</div>
			</div>

			<div className='mb-4 filter-group'>
				<label
					htmlFor='est-rating'
					className='mb-1 text-gray-900 dark:text-gray-200'
				>
					{t('establishments.rating_min')}
				</label>
				<Controller
					name='rating'
					control={control}
					render={({ field }) => (
						<input
							{...field}
							id='est-rating'
							type='number'
							min={0}
							max={5}
							step={0.1}
							placeholder={t('establishments.rating_min', 'Min rating')}
							className='w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400'
						/>
					)}
				/>
			</div>

			<div className='mb-4 filter-group'>
				<label
					htmlFor='est-check-min'
					className='mb-1 text-gray-900 dark:text-gray-200'
				>
					{t('establishments.average_check_min')}
				</label>
				<Controller
					name='averageCheckMin'
					control={control}
					render={({ field }) => (
						<input
							{...field}
							id='est-check-min'
							type='number'
							min={0}
							placeholder={t('establishments.average_check_min', 'Min check')}
							className='w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400'
						/>
					)}
				/>
			</div>

			<div className='mb-4 filter-group'>
				<label
					htmlFor='est-check-max'
					className='mb-1 text-gray-900 dark:text-gray-200'
				>
					{t('establishments.average_check_max')}
				</label>
				<Controller
					name='averageCheckMax'
					control={control}
					render={({ field }) => (
						<input
							{...field}
							id='est-check-max'
							type='number'
							min={0}
							placeholder={t('establishments.average_check_max', 'Max check')}
							className='w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400'
						/>
					)}
				/>
			</div>

			<div className='mb-4 filter-group'>
				<label
					htmlFor='est-order-by'
					className='mb-1 text-gray-900 dark:text-gray-200'
				>
					{t('establishments.order_by_label', 'Сортувати за')}
				</label>
				<Controller
					name='orderBy'
					control={control}
					render={({ field }) => (
						<Select
							options={options.orderByOptions}
							value={
								options.orderByOptions.find(
									(opt) => opt.value === field.value,
								) || null
							}
							onChange={(opt) => field.onChange(opt ? opt.value : '')}
							placeholder={t('establishments.order_by_label', 'Sort by')}
							className='mt-2'
							classNamePrefix='react-select'
							getOptionLabel={(opt) =>
								t(`establishments.order_by.${opt.value}`, opt.label)
							}
						/>
					)}
				/>
			</div>

			<div className='mb-6 filter-group'>
				<label
					htmlFor='est-order'
					className='mb-1 text-gray-900 dark:text-gray-200'
				>
					{t('establishments.order_label', 'Порядок')}
				</label>
				<Controller
					name='order'
					control={control}
					render={({ field }) => (
						<Select
							options={options.orderOptions}
							value={
								options.orderOptions.find((opt) => opt.value === field.value) ||
								null
							}
							onChange={(opt) => field.onChange(opt ? opt.value : '')}
							placeholder={t('establishments.order_label', 'Order')}
							className='mt-2'
							classNamePrefix='react-select'
							getOptionLabel={(opt) =>
								t(`establishments.order.${opt.value}`, opt.label)
							}
						/>
					)}
				/>
			</div>

			<div className='mb-4 filter-group'>
				<label className='mb-1 text-gray-900 dark:text-gray-200'>
					{t('filters.tags', 'Теги')}
				</label>
				<Controller
					name='tags'
					control={control}
					render={({ field }) => (
						<Select
							isMulti
							options={tagOptions}
							value={tagOptions.filter((opt) =>
								field.value?.includes(opt.value),
							)}
							onChange={(opts) => field.onChange(opts.map((opt) => opt.value))}
							placeholder={t('filters.tags', 'Select tags...')}
							className='mt-2'
							classNamePrefix='react-select'
						/>
					)}
				/>
			</div>

			<div className='flex gap-4 filter-group'>
				<button
					type='submit'
					className='w-full px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
					disabled={isApplyDisabled}
				>
					{t('establishments.apply_filters', 'Apply')}
				</button>
				<button
					type='button'
					onClick={onReset}
					className='w-full px-6 py-2 text-gray-900 transition bg-gray-200 rounded-lg dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'
				>
					{t('establishments.reset_filters', 'Reset')}
				</button>
			</div>
			{geoError && (
				<div className='mt-2 text-sm text-red-600 dark:text-red-400'>
					{geoError}
				</div>
			)}
		</form>
	);
};

export default EstablishmentsFilterForm;
