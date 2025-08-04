import { createApi } from '@reduxjs/toolkit/query/react';
import { HttpMethodEnum } from '../../enums/http-method.enum';
import { LocaleStorageKeysEnum } from '../../enums/locale-storage-keys.enum';
import {
	createBaseQueryWithReauth,
	setBearerToken,
} from '../../helpers/api.helper';
import type {
	IPlace,
	IPlaceListQuery,
	IPlaceListResponse,
} from '../../interfaces/place.interface';
import type { IUser } from '../../interfaces/user.interface';

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: createBaseQueryWithReauth('/api/users/'),
	endpoints: (builder) => ({
		getMe: builder.query<IUser, void>({
			query: () => {
				const accessToken = localStorage.getItem(
					LocaleStorageKeysEnum.ACCESS_TOKEN,
				);
				return {
					url: 'me',
					method: HttpMethodEnum.GET,
					headers: { Authorization: setBearerToken(accessToken) },
				};
			},
		}),
		updateMe: builder.mutation<IUser, { name: string }>({
			query: (body) => {
				const accessToken = localStorage.getItem(
					LocaleStorageKeysEnum.ACCESS_TOKEN,
				);
				return {
					url: 'me',
					method: HttpMethodEnum.PATCH,
					headers: { Authorization: setBearerToken(accessToken) },
					body,
				};
			},
		}),
		updatePhoto: builder.mutation<IUser, { userId: string; photo: File }>({
			query: ({ userId, photo }) => {
				const accessToken = localStorage.getItem(
					LocaleStorageKeysEnum.ACCESS_TOKEN,
				);
				const formData = new FormData();
				formData.append('photo', photo);
				return {
					url: `${userId}/photo`,
					method: HttpMethodEnum.PATCH,
					headers: { Authorization: setBearerToken(accessToken) },
					body: formData,
				};
			},
		}),
		getMyEstablishments: builder.query<IPlaceListResponse, IPlaceListQuery>({
			query: (params) => {
				const accessToken = localStorage.getItem(
					LocaleStorageKeysEnum.ACCESS_TOKEN,
				);
				return {
					url: 'me/establishments',
					method: HttpMethodEnum.GET,
					headers: { Authorization: setBearerToken(accessToken) },
					params,
				};
			},
		}),
		deleteMe: builder.mutation<void, void>({
			query: () => {
				const accessToken = localStorage.getItem(
					LocaleStorageKeysEnum.ACCESS_TOKEN,
				);
				return {
					url: 'me',
					method: HttpMethodEnum.DELETE,
					headers: { Authorization: setBearerToken(accessToken) },
				};
			},
		}),
		addFavorite: builder.mutation<IUser, { placeId: string }>({
			query: (body) => {
				const accessToken = localStorage.getItem(
					LocaleStorageKeysEnum.ACCESS_TOKEN,
				);
				return {
					url: 'favorites',
					method: HttpMethodEnum.POST,
					headers: { Authorization: setBearerToken(accessToken) },
					body,
				};
			},
		}),
		removeFavorite: builder.mutation<IUser, { placeId: string }>({
			query: (body) => {
				const accessToken = localStorage.getItem(
					LocaleStorageKeysEnum.ACCESS_TOKEN,
				);
				return {
					url: 'favorites',
					method: HttpMethodEnum.DELETE,
					headers: { Authorization: setBearerToken(accessToken) },
					body,
				};
			},
		}),
		getFavorites: builder.query<IPlace[], void>({
			query: () => {
				const accessToken = localStorage.getItem(
					LocaleStorageKeysEnum.ACCESS_TOKEN,
				);
				return {
					url: 'me/favorites',
					method: HttpMethodEnum.GET,
					headers: { Authorization: setBearerToken(accessToken) },
				};
			},
		}),
	}),
});

export const {
	useGetMeQuery,
	useUpdateMeMutation,
	useUpdatePhotoMutation,
	useGetMyEstablishmentsQuery,
	useDeleteMeMutation,
	useAddFavoriteMutation,
	useRemoveFavoriteMutation,
	useGetFavoritesQuery,
} = userApi;
