import type { PlaceWorkingDayEnum } from '../enums/place-working-day.enum';
import type {
	OrderEnum,
	PlaceFeatureEnum,
	PlaceListOrderEnum,
	PlaceTypeEnum,
} from '../enums/place.enums';
import type { IPlaceView } from './place-view.interface';

export interface IPlace {
	_id: string;
	name: string;
	description: string;
	address: string;
	location: {
		lng: number;
		lat: number;
	};
	photo: string;
	tags: string[];
	type: PlaceTypeEnum;
	features: PlaceFeatureEnum[];
	averageCheck: number;
	rating: number;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
	isModerated: boolean;
	contacts?: {
		phone?: string;
		tg?: string;
		email?: string;
	};
	workingHours?: IWorkingHour[];
}

export interface IPlaceListQuery {
	name?: string;
	type?: PlaceTypeEnum | string;
	features?: PlaceFeatureEnum[] | string;
	tags?: string[] | string;
	rating?: number;
	averageCheckMin?: number;
	averageCheckMax?: number;
	orderBy?: PlaceListOrderEnum;
	order?: OrderEnum;
	page?: number;
	limit?: number;
}

export interface IPlaceListResponse extends IPlaceListQuery {
	data: IPlace[];
	total: number;
}

export interface IWorkingHour {
	day: PlaceWorkingDayEnum;
	from?: string;
	to?: string;
	closed?: boolean;
}

export type IPlaceWithViews = IPlace & { viewsCount: number };

export type IPlaceViewStats = { views: IPlaceView[]; count: number };
