// Axios request interceptor -> add JWT token to requests

import axios from "axios";

export function jwtInterceptor() {
  axios.interceptors.request.use((request) => {
    const token = localStorage.getItem("token");
    const isApiUrl = request.url.startsWith(process.env.REACT_APP_API_URL);

    // Only add header if token and the request url is API_URL
    if (token && isApiUrl) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    request.cors = {
      origin: process.env.REACT_APP_ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Authorization", "Content-Type"],
      credentials: true,
    };

    return request;
  });
}
