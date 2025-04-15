import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { axiosApi } from "./api/api";

const AppConfig = {
  apiBase: "http://52.163.63.205/api/",
};

const baseQuery = fetchBaseQuery({
  baseUrl: AppConfig.apiBase,
  prepareHeaders: (headers) => {
    const accessToken = Cookies.get("accessToken");
    headers.set("Authorization", `Bearer ${accessToken}`);
    headers.set("Accept-Language", "vi");
    return headers;
  },
});

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    if (result.error.status === 401) {
      const refreshToken = Cookies("accessToken");
      const refreshResult = await axiosApi.refreshToken(refreshToken);

      if (refreshResult.data) {
        const newHeaders = {
          Authorization: `Bearer ${refreshResult.data?.acceptToken}`,
        };
        Cookies.set("accessToken", refreshResult.data?.acceptToken, {
          maxAge: 60 * 60 * 24 * 400,
        });

        result = await baseQuery(args, api, {
          ...extraOptions,
          headers: newHeaders,
        });
      } else {
        // window.location.href = process.env.NEXT_PUBLIC_ACCOUNT_URL as string;
      }
    } else {
      return result;
    }
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  refetchOnFocus: false,
  keepUnusedDataFor: 0,
  endpoints: () => ({}),
});
