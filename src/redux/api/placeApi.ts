import { createApi } from '@reduxjs/toolkit/query/react';
import { HttpMethodEnum } from '../../enums/http-method.enum';
import { LocaleStorageKeysEnum } from '../../enums/locale-storage-keys.enum';
import { createBaseQueryWithReauth } from '../../helpers/api.helper';
import type {
	IPlace,
	IPlaceListQuery,
	IPlaceListResponse,
	IPlaceWithViews,
} from '../../interfaces/place.interface';

export const placeApi = createApi({
	reducerPath: 'placeApi',
	baseQuery: createBaseQueryWithReauth('/api/places/'),
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
		getById: builder.query<IPlaceWithViews, string>({
			query: (id) => ({
				url: id,
				method: HttpMethodEnum.GET,
			}),
		}),
		createPlace: builder.mutation<IPlace, Partial<IPlace>>({
			query: (body) => {
				const accessToken = localStorage.getItem(
					LocaleStorageKeysEnum.ACCESS_TOKEN,
				);
				return {
					url: '',
					method: HttpMethodEnum.POST,
					body,
					headers: { Authorization: `Bearer ${accessToken}` },
				};
			},
		}),
		updatePlace: builder.mutation<
			IPlace,
			{ id: string; data: Partial<IPlace> }
		>({
			query: ({ id, data }) => {
				const accessToken = localStorage.getItem(
					LocaleStorageKeysEnum.ACCESS_TOKEN,
				);
				return {
					url: id,
					method: HttpMethodEnum.PATCH,
					body: data,
					headers: { Authorization: `Bearer ${accessToken}` },
				};
			},
		}),
		deletePlace: builder.mutation<void, string>({
			query: (id) => {
				const accessToken = localStorage.getItem(
					LocaleStorageKeysEnum.ACCESS_TOKEN,
				);
				return {
					url: id,
					method: HttpMethodEnum.DELETE,
					headers: { Authorization: `Bearer ${accessToken}` },
				};
			},
		}),
		addView: builder.mutation<void, string>({
			query: (id) => {
				const accessToken = localStorage.getItem(
					LocaleStorageKeysEnum.ACCESS_TOKEN,
				);
				return {
					url: `${id}/view`,
					method: HttpMethodEnum.POST,
					headers: { Authorization: `Bearer ${accessToken}` },
				};
			},
		}),
		updatePhoto: builder.mutation<IPlace, { id: string; photo: File }>({
			query: ({ id, photo }) => {
				const accessToken = localStorage.getItem(
					LocaleStorageKeysEnum.ACCESS_TOKEN,
				);
				const formData = new FormData();
				formData.append('photo', photo);
				return {
					url: `${id}/photo`,
					method: HttpMethodEnum.PATCH,
					body: formData,
					headers: { Authorization: `Bearer ${accessToken}` },
				};
			},
		}),
	}),
});

export const {
	useGetListQuery,
	useGetTagsQuery,
	useGetByIdQuery,
	useCreatePlaceMutation,
	useUpdatePlaceMutation,
	useDeletePlaceMutation,
	useAddViewMutation,
	useUpdatePhotoMutation,
} = placeApi;
