import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import EstablishmentsFilterForm from '../../components/EstablishmentsFilterForm';
import EstablishmentsGrid from '../../components/EstablishmentsGrid';
import Pagination from '../../components/Pagination';
import {
	featureOptions,
	orderByOptions,
	orderOptions,
	typeOptions,
} from '../../constants/establishments.constants';
import { PAGE_SIZE } from '../../constants/pagination.constants';
import { OrderEnum, PlaceListOrderEnum } from '../../enums/place.enums';
import {
	parseFeatures,
	parseOrder,
	parseOrderBy,
	parseTags,
	parseType,
} from '../../helpers/establishments.parsers';
import { useGetListQuery } from '../../redux/api/placeApi';

export interface IEstablishmentsFilterForm {
	name: string;
	type: string;
	features: string[];
	rating: number;
	averageCheckMin: number;
	averageCheckMax: number;
	orderBy: string;
	order: string;
	tags: string[];
}

const defaultValues: IEstablishmentsFilterForm = {
	name: '',
	type: '',
	features: [],
	rating: 0,
	averageCheckMin: 0,
	averageCheckMax: 0,
	orderBy: PlaceListOrderEnum.CREATED_AT,
	order: OrderEnum.DESC,
	tags: [],
};

const EstablishmentsListSection = () => {
	const { t } = useTranslation();
	const [searchParams, setSearchParams] = useSearchParams();
	const { control, handleSubmit, reset, watch } =
		useForm<IEstablishmentsFilterForm>({
			defaultValues,
		});
	const [appliedFilters, setAppliedFilters] = useState<{
		filters: IEstablishmentsFilterForm;
		page: number;
	}>({ filters: defaultValues, page: 1 });

	const [coords, setCoords] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const [geoError, setGeoError] = useState<string | null>(null);

	const watchedOrderBy = watch('orderBy');

	useEffect(() => {
		if (watchedOrderBy === PlaceListOrderEnum.DISTANCE) {
			if (!coords) {
				navigator.geolocation.getCurrentPosition(
					(pos) => {
						setCoords({
							latitude: pos.coords.latitude,
							longitude: pos.coords.longitude,
						});
						setGeoError(null);
					},
					() => {
						setGeoError(
							t(
								'establishments.geo_error',
								'To sort by distance, allow geolocation in your browser.',
							),
						);
					},
				);
			}
		} else {
			setGeoError(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watchedOrderBy]);

	useEffect(() => {
		const params = Object.fromEntries(searchParams.entries());
		let page = 1;
		if (params.page) page = Number(params.page);

		// the thing is that I need to create a new object with the same keys as defaultValues
		// so I cast it to Record to ensure all filter keys exist, even if some values are missing or dynamic
		// https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
		const form = { ...defaultValues } as Record<
			keyof IEstablishmentsFilterForm,
			unknown
		>;

		(Object.keys(defaultValues) as (keyof IEstablishmentsFilterForm)[]).forEach(
			(key) => {
				if (params[key]) {
					if (key === 'features' || key === 'tags') {
						form[key] = Array.isArray(params[key])
							? params[key]
							: params[key].split(',');
					} else if (typeof defaultValues[key] === 'number') {
						form[key] = Number(params[key]);
					} else {
						form[key] = params[key];
					}
				}
			},
		);

		reset(form as IEstablishmentsFilterForm);
		setAppliedFilters({ filters: form as IEstablishmentsFilterForm, page });
	}, []); // eslint-disable-line

	const updateUrl = (filters: IEstablishmentsFilterForm, page: number) => {
		const params: Record<string, string | string[]> = {};

		Object.entries(filters).forEach(([key, value]) => {
			if (Array.isArray(value) && value.length) params[key] = value; // масив!
			else if (typeof value === 'number' && value !== 0)
				params[key] = String(value);
			else if (typeof value === 'string' && value) params[key] = value;
		});

		if (page > 1) params.page = String(page);
		setSearchParams(params, { replace: true });
	};

	const queryParams = {
		...appliedFilters.filters,
		page: appliedFilters.page,
		limit: PAGE_SIZE,
		type: parseType(appliedFilters.filters.type),
		features: parseFeatures(appliedFilters.filters.features),
		tags: parseTags(appliedFilters.filters.tags),
		rating: appliedFilters.filters.rating || undefined,
		averageCheckMin: appliedFilters.filters.averageCheckMin || undefined,
		averageCheckMax: appliedFilters.filters.averageCheckMax || undefined,
		orderBy: parseOrderBy(appliedFilters.filters.orderBy),
		order: parseOrder(appliedFilters.filters.order),
		name: appliedFilters.filters.name || undefined,
		...(appliedFilters.filters.orderBy === PlaceListOrderEnum.DISTANCE && coords
			? { latitude: coords.latitude, longitude: coords.longitude }
			: {}),
	};

	const { data, isLoading, isError } = useGetListQuery(queryParams);
	console.log(data);

	const onSubmit = (form: IEstablishmentsFilterForm) => {
		setAppliedFilters({ filters: form, page: 1 });
		updateUrl(form, 1);
	};

	const handleReset = () => {
		reset();
		setAppliedFilters({ filters: defaultValues, page: 1 });
		updateUrl(defaultValues, 1);
	};

	const handlePageChange = (page: number) => {
		setAppliedFilters((prev) => ({ ...prev, page }));
		updateUrl(appliedFilters.filters, page);
	};

	const isApplyDisabled =
		watch('orderBy') === PlaceListOrderEnum.DISTANCE && !!geoError;

	return (
		<section className='flex gap-8 places-page'>
			<aside className='filters bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col gap-6 min-w-[260px] max-w-[320px] h-fit'>
				<EstablishmentsFilterForm
					control={control}
					handleSubmit={handleSubmit}
					onSubmit={onSubmit}
					onReset={handleReset}
					geoError={geoError}
					isApplyDisabled={isApplyDisabled}
					options={{
						typeOptions,
						featureOptions,
						orderByOptions,
						orderOptions,
					}}
					t={t}
				/>
			</aside>
			<section className='flex-1 places-content'>
				{isLoading ? (
					<div className='py-10 text-center text-gray-500 dark:text-gray-300'>
						{t('establishments.loading', 'Loading...')}
					</div>
				) : isError ? (
					<div className='py-10 text-center text-red-500'>
						{t('establishments.error', 'Failed to load establishments.')}
					</div>
				) : data && data.data.length === 0 ? (
					<div className='py-10 text-center text-gray-500 dark:text-gray-300'>
						{t('establishments.empty', 'No establishments found.')}
					</div>
				) : (
					<>
						{data && data.data.length > 0 && (
							<EstablishmentsGrid
								data={data.data}
								t={t}
								minHeight='720px'
							/>
						)}
						{data && data.total > PAGE_SIZE && (
							<Pagination
								page={appliedFilters.page}
								total={data.total}
								pageSize={PAGE_SIZE}
								onPageChange={handlePageChange}
							/>
						)}
					</>
				)}
			</section>
		</section>
	);
};

export default EstablishmentsListSection;
