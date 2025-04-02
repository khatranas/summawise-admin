import axiosService from "../axiosService.service";

export const axiosApi = {
  login: async (payload: any) => {
    return await axiosService.post("/auth/login", payload);
  },
  register: async (payload: {
    email: string;
    password: string;
    name: string;
  }) => {
    return await axiosService.post("/auth/sign-up", payload);
  },
  refreshToken: async (payload: { refreshToken: string }) => {
    return await axiosService.post("/auth/refresh-token", payload);
  },
  forgotPassword: async (payload: any) => {
    return await axiosService.post("/auth/forgot-password", payload);
  },
  account: async (id: string, params = {}) => {
    return await axiosService.get(`/users/${id}`, { params });
  },
  accountPost: async (id, params) => {
    return await axiosService.post(`/users/${id}`, params);
  },
  paymentGet: async () => {
    return await axiosService.get("/payment/all-orders");
  },
  pricingGet: async () => {
    return await axiosService.get("/pricing");
  },
  dashBoardUsers: async (_params = {}) => {
    return await axiosService.get(`/users`);
  },
};
