import {
	OrderEnum,
	PlaceFeatureEnum,
	PlaceListOrderEnum,
	PlaceTypeEnum,
} from '../enums/place.enums';

export const typeOptions = Object.entries(PlaceTypeEnum).map(
	([key, value]) => ({
		value,
		label: key,
	}),
);

export const featureOptions = Object.entries(PlaceFeatureEnum).map(
	([key, value]) => ({
		value,
		label: key,
	}),
);

export const orderByOptions = Object.entries(PlaceListOrderEnum).map(
	([key, value]) => ({ value, label: key }),
);

export const orderOptions = [
	{ value: OrderEnum.ASC, label: OrderEnum.ASC },
	{ value: OrderEnum.DESC, label: OrderEnum.DESC },
];
