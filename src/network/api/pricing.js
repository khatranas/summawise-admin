import { api } from '../baseApi';
const AppConfig = {
    apiBase: import.meta.env.VITE_API_URL,
};

export const pricingAPI = api.injectEndpoints({
    endpoints: (builder) => ({
        deletePricing: builder.mutation({
            query: (id) => ({
                url: `${AppConfig.apiBase}pricing/${id}`,
                method: 'DELETE',
            }),
        }),
        createPricing: builder.mutation({
            query: (data) => ({
                url: `${AppConfig.apiBase}pricing`,
                method: 'POST',
                body: data,
            }),
        }),
        updatePricing: builder.mutation({
            query: (data) => ({
                url: `${AppConfig.apiBase}pricing/${data.id}`,
                method: 'PUT',
                body: data,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useDeletePricingMutation,
    useCreatePricingMutation,
    useUpdatePricingMutation,
} = pricingAPI;
