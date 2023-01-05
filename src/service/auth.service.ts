import { PrismaClient } from "@prisma/client";
import { UserRegisterDto } from "../dtos"

const client = new PrismaClient()

export class AuthService {

    userRegister = async (data: UserRegisterDto ) => {
        await client.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
            }
        })
    }

    findUserByMail = async (email: string) => {
        return await client.user.findUnique({
            where: {
                email
            }
        })
    }

    findUserByVerifyId = async (verifyId: string) => {
        return await client.user.findFirst({
            where: {
                verificationId: verifyId
            },
            select: {
                id: true,
                name: true,
                surname: true,
                birthday: true,
                phone: true,
                email: true,
                password: false,
                is_verified: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                verificationId: true
            }
        })
    }
    
}

