export interface IProduct {
    _id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    stock: number;
    image?: string;
}

export interface IProductPayload {
    name: string;
    price: number;
    category: string;
    description: string;
    stock: number;
    image?: string;
}

export interface IProductListResponse {
    success: boolean;
    products?: IProduct[];
    data?: IProduct[];
    total?: number;
    totalPages?: number;
    page?: number;
}