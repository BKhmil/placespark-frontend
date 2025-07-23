import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HttpMethodEnum } from '../../enums/http-method.enum';
import type {
	IPlaceListQuery,
	IPlaceListResponse,
} from '../../interfaces/place.interface';

export const placeApi = createApi({
	reducerPath: 'placeApi',
	baseQuery: fetchBaseQuery({ baseUrl: '/api/places/' }),
	endpoints: (builder) => ({
		getList: builder.query<IPlaceListResponse, IPlaceListQuery>({
			query: (params) => ({
				url: '',
				method: HttpMethodEnum.GET,
				params,
			}),
		}),
		getTags: builder.query<{ tags: string[] }, void>({
			query: () => ({
				url: 'tags',
				method: HttpMethodEnum.GET,
			}),
		}),
	}),
});

export const { useGetListQuery, useGetTagsQuery } = placeApi;
