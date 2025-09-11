import { AxiosError } from "axios";
import api from "../utils/api";

export class SummaryService {
    static getsummary = async() => {
        try {
            const { data } = await api.get('/summary/monthly');
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

