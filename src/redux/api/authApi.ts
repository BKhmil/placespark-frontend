import { createApi } from '@reduxjs/toolkit/query/react';
import { HttpMethodEnum } from '../../enums/http-method.enum';
import { LocaleStorageKeysEnum } from '../../enums/locale-storage-keys.enum';
import { createBaseQueryWithReauth, setBearerToken } from '../../helpers/api.helper';
import type {
	IAuthResponse,
	ISignInRequest,
	ISignUpRequest,
} from '../../interfaces/auth.interface';
import type { ITokenPair } from '../../interfaces/token-pair.interface';

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: createBaseQueryWithReauth('/api/auth/'),
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
					LocaleStorageKeysEnum.ACCESS_TOKEN,
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
					LocaleStorageKeysEnum.ACCESS_TOKEN,
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
					LocaleStorageKeysEnum.REFRESH_TOKEN,
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
					LocaleStorageKeysEnum.REFRESH_TOKEN,
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
