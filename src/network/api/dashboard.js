// import { api } from "../baseApi";

// const AppConfig = {
//   apiBase: import.meta.env.VITE_API_URL,
// };

// export const dashBoardApi = api.injectEndpoints({
//   endpoints: (builder) => ({
//     getDashBoardUsers: builder.query({
//       query: ({ search, limit, skip, sort }) => {
//         const params = new URLSearchParams();

//         if (search) params.append("search", search);
//         if (limit) params.append("limit", limit);
//         if (skip) params.append("skip", skip);
//         if (sort) params.append("sort", sort);

//         return {
//           url: `${AppConfig.apiBase}users`,
//           method: "GET",
//         };
//       },
//     }),
//   }),
//   overrideExisting: false,
// });

// export const { useGetDashBoardUsersQuery } = dashBoardApi;
