import axios from 'axios';
import { AxiosError } from 'axios';
import { ApiError } from '@app/api/ApiError';
import { readToken } from '@app/services/localStorage.service';

export const LocalUrl =  "https://localhost:7265/api/"
export const httpApi = axios.create({
  baseURL:LocalUrl,
});

// httpApi.interceptors.request.use((config) => {
//   config.headers = { ...config.headers, Authorization: `Bearer ${readToken()}` };

//   return config;
// });

// httpApi.interceptors.response.use(undefined, (error: AxiosError) => {
//   throw new ApiError<ApiErrorData>(error.response?.data.message || error.message, error.response?.data);
// });

// export interface ApiErrorData {
//   message: string;
// }
