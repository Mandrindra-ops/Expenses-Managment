import { AxiosError } from "axios";
import api from "../utils/api";

export class ProfilService {
    static getProfil = async() => {
        try {
            const { data } = await api.get<{email : string, createdAt: string}>('user/profile');
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
  static changePassword = async (oldPassword: string, newPassword: string) => {
    await api.post(`user/change-password`, { oldPassword, newPassword });
  }

}
