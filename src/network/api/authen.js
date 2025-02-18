import { api } from '../baseApi';
const AppConfig = {
    apiBase: "http://localhost:8000/api/",
};

export const userAPI = api.injectEndpoints({
	endpoints: (builder) => ({
		getUser: builder.query({
			query: () => ({
				url: `${AppConfig.apiBase}users`,
				method: 'GET',
			}),
		}),
		deleteUser: builder.mutation({
			query: (id) => ({
				url: `${AppConfig.apiBase}users/${id}`,
				method: 'DELETE',
			}),
		}),
		createUser: builder.mutation({
			query: (data) => ({
				url: `${AppConfig.apiBase}users`,
				method: 'POST',
				body: data,
			}),
		}),
		updateUser: builder.mutation({
			query: (data) => ({
				url: `${AppConfig.apiBase}users/${data.id}`,
				method: 'PATCH',
				body: data,
			}),
		}),
		getUserById : builder.query({
			query: (id) => ({
				url: `${AppConfig.apiBase}users/${id}`,
				method: 'GET',
			}),
		}),
	}),
	overrideExisting: false,
});

export const {
	useDeleteUserMutation,
	useCreateUserMutation,
	useUpdateUserMutation,
	useGetUserByIdQuery,
	useGetUserQuery,
} = userAPI;
