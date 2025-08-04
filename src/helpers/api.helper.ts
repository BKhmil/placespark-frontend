import { fetchBaseQuery, type BaseQueryFn } from '@reduxjs/toolkit/query';
import { HttpMethodEnum } from '../enums/http-method.enum';
import { LocaleStorageKeysEnum } from '../enums/locale-storage-keys.enum';
import type { ITokenPair } from '../interfaces/token-pair.interface';

export const setBearerToken = (token: string | null) => {
	return token ? `Bearer ${token}` : 'Bearer ';
};

export const createBaseQueryWithReauth = (baseUrl: string): BaseQueryFn => {
	return async (args, api, extraOptions) => {
		let result = await fetchBaseQuery({ baseUrl })(args, api, extraOptions);
		if (result.error && result.error.status === 401) {
			const refreshToken = localStorage.getItem(
				LocaleStorageKeysEnum.REFRESH_TOKEN,
			);
			if (refreshToken) {
				const refreshResult = await fetchBaseQuery({ baseUrl: '/api/auth/' })(
					{
						url: 'refresh',
						method: HttpMethodEnum.POST,
						headers: { Authorization: setBearerToken(refreshToken) },
					},
					api,
					extraOptions,
				);
				if (refreshResult.data) {
					const { accessToken, refreshToken: newRefreshToken } =
						refreshResult.data as ITokenPair;
					localStorage.setItem(LocaleStorageKeysEnum.ACCESS_TOKEN, accessToken);
					localStorage.setItem(
						LocaleStorageKeysEnum.REFRESH_TOKEN,
						newRefreshToken,
					);

					if (typeof args === 'object' && args.headers) {
						args.headers['Authorization'] = setBearerToken(accessToken);
					}
					result = await fetchBaseQuery({ baseUrl })(args, api, extraOptions);
				} else {
					localStorage.clear();
					api.dispatch({ type: 'user/removeUser' });
				}
			} else {
				localStorage.clear();
				api.dispatch({ type: 'user/removeUser' });
			}
		}
		return result;
	};
};
