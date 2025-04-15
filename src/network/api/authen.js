import { api } from "../baseApi";
const AppConfig = {
  apiBase: import.meta.env.VITE_API_URL,
};

export const userAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url: `${AppConfig.apiBase}users`,
        method: "GET",
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${AppConfig.apiBase}users/${id}`,
        method: "DELETE",
      }),
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: `${AppConfig.apiBase}users`,
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${AppConfig.apiBase}users/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: `${AppConfig.apiBase}auth/login`,
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUserQuery,
  useLoginUserMutation,
} = userAPI;

export const checkoutAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: (params) => ({
        url: `${AppConfig.apiBase}users/me`,
        method: "GET",
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetProfileQuery } = checkoutAPI;
