import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HttpMethodEnum } from '../../enums/http-method.enum';
import { LocaleStorageEntriesEnum } from '../../enums/locale-storage-entries.enum';
import { setBearerToken } from '../../helpers/api.helper';
import type {
	IAuthResponse,
	ISignInRequest,
	ISignUpRequest,
} from '../../interfaces/auth.interface';
import type { ITokenPair } from '../../interfaces/token-pair.interface';

export const baseQueryWithReauth: BaseQueryFn = async (
	args,
	api,
	extraOptions,
) => {
	let result = await fetchBaseQuery({ baseUrl: '/api/auth/' })(
		args,
		api,
		extraOptions,
	);
	if (result.error && result.error.status === 401) {
		const refreshToken = localStorage.getItem(
			LocaleStorageEntriesEnum.REFRESH_TOKEN,
		);
		if (refreshToken) {
			console.log('refreshing');
			const refreshResult = await fetchBaseQuery({ baseUrl: '/api/auth/' })(
				{
					url: 'refresh',
					method: HttpMethodEnum.POST,
					headers: { Authorization: setBearerToken(refreshToken) },
				},
				api,
				extraOptions,
			);
			console.log(refreshResult);
			if (refreshResult.data) {
				const { accessToken, refreshToken: newRefreshToken } =
					refreshResult.data as ITokenPair;
				localStorage.setItem(
					LocaleStorageEntriesEnum.ACCESS_TOKEN,
					accessToken,
				);
				localStorage.setItem(
					LocaleStorageEntriesEnum.REFRESH_TOKEN,
					newRefreshToken,
				);

				// initial idea is when we refresh token, we need to re-fetch the request
				// so if we have an objects as <args> it means that we may provide some headers
				// in this case we need to re-fetch the request with the new token
				if (typeof args === 'object' && args.headers) {
					args.headers['Authorization'] = setBearerToken(accessToken);
				}
				result = await fetchBaseQuery({ baseUrl: '/api/auth/' })(
					args,
					api,
					extraOptions,
				);
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

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		signUp: builder.mutation<IAuthResponse, ISignUpRequest>({
			query: (body) => ({
				url: 'sign-up',
				method: HttpMethodEnum.POST,
				body,
			}),
		}),
		signIn: builder.mutation<IAuthResponse, ISignInRequest>({
			query: (body) => ({
				url: 'sign-in',
				method: HttpMethodEnum.POST,
				body,
			}),
		}),
		logout: builder.mutation<void, void>({
			query: () => {
				const accessToken = localStorage.getItem(
					LocaleStorageEntriesEnum.ACCESS_TOKEN,
				);
				return {
					url: 'logout',
					method: HttpMethodEnum.POST,
					headers: { Authorization: setBearerToken(accessToken) },
				};
			},
		}),
		logoutAll: builder.mutation<void, void>({
			query: () => {
				const accessToken = localStorage.getItem(
					LocaleStorageEntriesEnum.ACCESS_TOKEN,
				);
				return {
					url: 'logout-all',
					method: HttpMethodEnum.POST,
					headers: { Authorization: setBearerToken(accessToken) },
				};
			},
		}),
		verifyEmail: builder.mutation<void, { token: string }>({
			query: (body) => ({
				url: 'verify-email',
				method: HttpMethodEnum.POST,
				body,
			}),
		}),
		refresh: builder.mutation<ITokenPair, void>({
			query: () => {
				const refreshToken = localStorage.getItem(
					LocaleStorageEntriesEnum.REFRESH_TOKEN,
				);
				return {
					url: 'refresh',
					method: HttpMethodEnum.POST,
					headers: { Authorization: setBearerToken(refreshToken) },
				};
			},
		}),
		ping: builder.mutation<void, void>({
			query: () => {
				const refreshToken = localStorage.getItem(
					LocaleStorageEntriesEnum.REFRESH_TOKEN,
				);
				return {
					url: 'ping',
					method: HttpMethodEnum.GET,
					headers: { Authorization: setBearerToken(refreshToken) },
				};
			},
		}),
	}),
});

export const {
	useSignUpMutation,
	useSignInMutation,
	useLogoutMutation,
	useLogoutAllMutation,
	useVerifyEmailMutation,
	useRefreshMutation,
	usePingMutation,
} = authApi;
