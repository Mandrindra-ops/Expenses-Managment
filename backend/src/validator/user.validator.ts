import z from "zod";

export function userValidator<T>(body: T):{status : string , data : any} {
    
    const userShema = z.object({
            email : z.email(),
            password: z.string().min(6),
    })
    const parsed = userShema.safeParse(body)
    if(!parsed.success){
    console.error("Form invalide : ", parsed.error)
        return {
            status: "error",
            data : parsed.error
        }
    }
    return {
        status: "success",
        data: parsed.data
    }
}
