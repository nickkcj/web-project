import axios from "axios";
import { store } from "../services/StoreConfig";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    (config) => {
        const token = store.getState().login.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
