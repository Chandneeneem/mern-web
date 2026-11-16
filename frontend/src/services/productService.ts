import api from './api';

import type {
    IProductPayload,
    IProductListResponse,
    IProduct
} from '../utils/types/product.types';

// Get product listing
export const getProducts = async (params: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
}) => {
    const response = await api.get<IProductListResponse>(
        '/products',
        { params }
    );

    return response.data;
};

// Add product
export const addProduct = async (data: IProductPayload) => {
    const response = await api.post('/products', data);
    return response.data;
};

// Get single product
export const getProductById = async (id: string) => {
    const response = await api.get<IProduct>(`/products/${id}`);
    return response.data;
};

// Update product
// export const updateProduct = async (
//     id: string,
//     data: IProductPayload
// ) => {
//     const response = await api.put(`/products/${id}`, data);
//     return response.data;
// };
export const updateProduct = async (
    data: IProductPayload & { id: string }
) => {
    const response = await api.put('/products', data);
    return response.data;
};

// Delete product
// export const deleteProduct = async (id: string) => {
//     const response = await api.delete(`/products/${id}`);
//     return response.data;
// };
export const deleteProduct = async (id: string) => {
    const response = await api.delete('/products', {
        data: { id }
    });
    return response.data;
};