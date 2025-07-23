import type {
	OrderEnum,
	PlaceFeatureEnum,
	PlaceListOrderEnum,
	PlaceTypeEnum,
} from '../enums/place.enums';

export interface IPlace {
	_id: string;
  name: string;
  description: string;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  photo: string;
  tags: string[];
  type: PlaceTypeEnum;
  features: string[];
  averageCheck: number;
  rating: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  views?: { userId: string; date: Date }[];
  contacts?: {
    phone?: string;
    tg?: string;
    email?: string;
  };
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
