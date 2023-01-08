import { client, UserRegisterDto } from "../imports"
import { db_client } from "../db/connection"

export class AuthService {

    userRegister = async (data: UserRegisterDto) => {
        await client.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                verificationId: data.verificationId
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

    deleteInActiveUsers = async () => {
        return await client.user.deleteMany({
            where: {
                is_verified: false
            }
        })
    }
}

