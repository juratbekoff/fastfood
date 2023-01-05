import { MailService, VerifyService, AuthService } from "../../service/";
import { Request, Response, NextFunction } from "express"
import { VerifyDto } from "../../dtos";
import jwt from 'jsonwebtoken'

const mailService = new MailService()
const verifyService = new VerifyService()
const authService = new AuthService()

export default async (req: Request, res: Response, next: NextFunction) => {
    try {

        let data: VerifyDto = {
            verificationId: req.body.verificationId,
            code: req.body.code
        }
        
        let checkConfirmCode = await mailService.checkConirmCode(String(data.verificationId), +data.code)
        
        if (!checkConfirmCode) {            
            return res.status(403).send({
                message: `Kiritilgan sms kodi notog'ri!`,
                is_active: false,
            })
        }

        let timOut = ((new Date().getTime() - checkConfirmCode.createdAt.getTime()) / 1000) > 60

        if (timOut) {

            await mailService.setMailState(checkConfirmCode.id)

            return res.status(403).send({
                message: `Kod eskirgan, yangitdan ro'yxatdan o'tishni amalga oshiring!`,
                is_active: false,
            })
        }

        const jsontoken = jwt.sign({ result: data }, 'qwert1', { expiresIn: "1y" })

        let getCreatedUser = await authService.findUserByVerifyId(data.verificationId)

        if (getCreatedUser) {
            await verifyService.verifyingUser(getCreatedUser.id)
        }

        return res.status(200).json({
            message: `Welcome!`,
            is_active: true,
            user: getCreatedUser,
            token: jsontoken
        })
    }
    catch (err) {
        next()
    }
}

