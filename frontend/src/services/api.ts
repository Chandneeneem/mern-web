
// import axios, {
//     AxiosError,
//     type InternalAxiosRequestConfig
// } from 'axios';

// const api = axios.create({
//     baseURL: 'http://localhost:5000/api',
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });

// // Request interceptor
// api.interceptors.request.use(
//     (config: InternalAxiosRequestConfig) => {
//         const token = localStorage.getItem('token');

//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }

//         return config;
//     },
//     (error: AxiosError) => {
//         return Promise.reject(error);
//     }
// );

// // Response interceptor
// api.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error: AxiosError) => {
//         if (error.response?.status === 401) {
//             const token = localStorage.getItem('token');

//             if (token) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('user');
//                 window.location.href = '/login';
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default api;

import axios, {
    AxiosError,
    type InternalAxiosRequestConfig
} from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            const token = localStorage.getItem('token');

            if (token) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
