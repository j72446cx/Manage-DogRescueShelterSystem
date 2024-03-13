import axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig} from 'axios';
import router from "../router";
import {ElMessageBox} from "element-plus";

const service:AxiosInstance = axios.create({
    timeout: 5000
});

let isSessionExpired = false;

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {

        let token = localStorage.getItem('ms_token');

        if (token){
            // @ts-ignore
            config.headers['token'] = token;
        }
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        console.log("Hello!")
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {

        if (response.status === 200) {

            return response;
        } else {

            Promise.reject();

        }
    },
    (error: AxiosError) => {
        console.log("Token expired");
        if (error.response?.status === 404 && error.response && !isSessionExpired){
            isSessionExpired = true;
            ElMessageBox.alert('Your session has been expired, please login again.', {
                title:"Session Expired",
                confirmButtonText : "Confirm",
                callback : (action :string) => {
                    localStorage.clear();
                    router.push('login');
                }
            });
        }

        return Promise.reject();
    }
);

export default service;
