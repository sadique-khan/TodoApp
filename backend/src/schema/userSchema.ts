import {email, z} from 'zod'

export const registerSchema = z.object({
    email : z.email("Invalid email format"),
    name : z.string().min(2,"Name must be at least 2 characters"),
    password : z.string().min(6,"Password must be atleast 6 characters long"),
});

export const login = z.object({
    email : z.email(),
    password : z.string().min(6)
})