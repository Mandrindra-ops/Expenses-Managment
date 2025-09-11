import { AxiosError } from "axios";
import type { User } from "../types";
import api from "../utils/api";

export class UserService {
    static me = async(): Promise<User> => {
        try {
            const { data } = await api.get<User>('/auth/me');
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
}
