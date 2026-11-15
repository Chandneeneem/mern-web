import api from './api';

import type {
    ILoginPayload,
    ISignupPayload,
    IAuthResponse
} from '../utils/types/auth.types';

// Signup API
export const signupUser = async (
    data: ISignupPayload
): Promise<IAuthResponse> => {
    const response = await api.post<IAuthResponse>(
        '/auth/register',
        data
    );

    return response.data;
};

// Login API
export const loginUser = async (
    data: ILoginPayload
): Promise<IAuthResponse> => {
    const response = await api.post<IAuthResponse>(
        '/auth/login',
        data
    );

    return response.data;
};