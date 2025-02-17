import { api } from '../baseApi';
const AppConfig = {
	apiBase: import.meta.env.VITE_API_URL,
};

export const userAPI = api.injectEndpoints({
	endpoints: (builder) => ({
		getUser: builder.query({
			query: () => ({
				url: `${AppConfig.apiBase}users`,
				method: 'GET',
			}),
			providesTags: ['User'],
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetUserQuery,
} = userAPI;
