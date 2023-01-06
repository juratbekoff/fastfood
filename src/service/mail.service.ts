import { PrismaClient } from "@prisma/client";

const client = new PrismaClient()

export class MailService {

    addConfirmCode = async (code: number, verificationId: string) => {
        await client.mailStore.create({
            data: {
                code,
                verificationId
            }
        })
    }

    checkConirmCode = async (verificationId: string, code: number) => {
        return await client.mailStore.findFirst({
            where: {
                verificationId,
                code,
            }
        })
    }

    checkConirmCodeStatus = async (verificationId: string) => {
        return await client.mailStore.findUnique({
            where: {
                verificationId,
            }
        })
    }

    
    setMailState = async (id: number) => {
        await client.mailStore.update({
            where: {
                id
            },
            data: {
                isActive: false
            }
        })
    }

    resetVerifyCode = async (verificationId: string, newCode: number) => {
        return await client.mailStore.update({
            where: {
                verificationId
            },
            data: {
                code: newCode
            }
        })
    }
}
