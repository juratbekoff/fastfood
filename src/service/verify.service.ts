import { client } from "../helpers/imports"

export class VerifyService {

    verifyingUser = async (userId: number) => {
        return await client.user.update({
            where: {
                id: userId
            },
            data: {
                is_verified: true,
                role: "User"
            }
        })
    }
}

