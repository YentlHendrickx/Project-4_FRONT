// Axios request interceptor -> add JWT token to requests

import axios from 'axios';

export function jwtInterceptor() {
    axios.interceptors.request.use(request => {
        const token = localStorage.getItem('token');
        const isApiUrl = request.url.startsWith(process.env.REACT_APP_API_URL);
        
        // Only add header if token and the request url is API_URL
        if (token && isApiUrl) {
            request.headers.Authorization = `Bearer ${token}`;
        }

        return request;
    });
}