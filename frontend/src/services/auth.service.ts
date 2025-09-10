import { AxiosError } from "axios";
import api from "../utils/api";
import type { LoginResponse,RegisterUser  } from "../types";

export class AuthService {
    static login = async(email: string, password: string): Promise<LoginResponse> => {
        try {
            const { data } = await api.post<LoginResponse>('/auth/login', {email, password});
            return data;
        } catch (error) {
            if(error instanceof AxiosError){
                console.log(error.response?.data);
                throw new Error(error.response?.data)
            }
            console.log(error);
            throw new Error('No puede iniciar sesión')
        }
    }

    static registerUser = async(email: string, password: string): Promise<RegisterUser> => {
        try {
            const { data } = await api.post<{email : string , password: string}>('/auth/signup',{email , password});
            return data;
        } catch (error) {
            if(error instanceof AxiosError){
                console.log(error.response?.data);
                throw new Error(error.response?.data)
            }
            console.log(error);
            throw new Error('No puede registrar al usuario')
        }
    }
}
