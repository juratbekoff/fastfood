import { PrismaClient } from "@prisma/client";

const client = new PrismaClient()

export class VerifyService {

    verifyingUser = async (userId: number) => {
        return await client.user.update({
            where: {
                id: userId
            },
            data: {
                is_verified: true
            }
        })
    }
    
}

