import axios from 'axios'
import cookies from 'js-cookie'

const createAdminAxiosInstance = () => {
    const instance = axios.create({
        baseURL: 'http://locahost:3000'
    });

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshToken = cookies.get('adminRefreshToken');
                    if (!refreshToken) {
                        throw new Error("No refresh token available");
                    }

                    const response = await axios.post('http://localhost:3000/admin/refreshtoken', {
                        refreshToken
                    });

                    console.log("response from adminAxiosInstance:", response);

                    if (response.data.success) {
                        const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;

                        cookies.set('adminAccessToken', accessToken);
                        cookies.set('adminRefreshToken', newRefreshToken);

                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return instance(originalRequest);
                    }
                } catch (refreshError) {
                    cookies.remove('adminAccessToken');
                    cookies.remove('adminRefreshToken');
                    window.location.href = '/admin';
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
    return instance
}

export const adminAxiosInstance = createAdminAxiosInstance()