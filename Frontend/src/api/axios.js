import axios from "axios";
import { auth } from "../firebase";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
    async (config) => {

        const user = auth.currentUser;

        if (user) {

            const token = await user.getIdToken();

            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;