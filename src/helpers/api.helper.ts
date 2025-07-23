export const setBearerToken = (token: string | null) => {
	return token ? `Bearer ${token}` : 'Bearer ';
};
