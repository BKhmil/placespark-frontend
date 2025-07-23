import {
	OrderEnum,
	PlaceFeatureEnum,
	PlaceListOrderEnum,
	PlaceTypeEnum,
} from '../enums/place.enums';

export const parseType = (val: string | undefined): PlaceTypeEnum | undefined => {
	if (!val) return undefined;
	return Object.values(PlaceTypeEnum).includes(val as PlaceTypeEnum)
		? (val as PlaceTypeEnum)
		: undefined;
}

export const parseFeatures = (
	val: string[] | undefined,
): PlaceFeatureEnum[] | undefined => {
	if (!val || !val.length) return undefined;
	return val.filter((f) =>
		Object.values(PlaceFeatureEnum).includes(f as PlaceFeatureEnum),
	) as PlaceFeatureEnum[];
}

export const parseOrderBy = (
	val: string | undefined,
): PlaceListOrderEnum | undefined => {
	if (!val) return undefined;
	return Object.values(PlaceListOrderEnum).includes(val as PlaceListOrderEnum)
		? (val as PlaceListOrderEnum)
		: undefined;
}

export const parseOrder = (val: string | undefined): OrderEnum | undefined => {
	if (!val) return undefined;
	return Object.values(OrderEnum).includes(val as OrderEnum)
		? (val as OrderEnum)
		: undefined;
}

export const parseTags = (val: string[] | undefined): string[] | undefined => {
	if (!val || !val.length) return undefined;
	return val;
}
