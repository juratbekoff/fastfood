import { MailService, AuthService } from "../../service/";
import { Request, Response, NextFunction } from "express"
import nodeMailer from "nodeMailer"
import { mailConfig } from '../../configs'

const mailService = new MailService()
const authService = new AuthService()

export default async (req: Request, res: Response, next: NextFunction) => {
    try {

        let { verificationId } = req.body
        let newCode = Math.ceil(Math.random() * 10_000)
        let findUserByVerifyId = await authService.findUserByVerifyId(String(verificationId))

        if (!findUserByVerifyId) {
            return res.status(403).send({
                message: `Sms kodni qayta yuborishda xatolik!`
            })
        }

        let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            service: 'gmail',
            auth: {
                user: mailConfig.myMail,
                pass: mailConfig.myPassword
            }
        })

        const mail_configs = {
            from: mailConfig.myMail,
            to: `${findUserByVerifyId.email}`,
            subject: `Test sms!`,
            text: `${newCode}`
        }

        transporter.sendMail(mail_configs, async function (error, info) {
            if (error) {
                console.log(error);
                return res.send("error occured!")
            }
            console.log(info.response);
        })

        // reset code
        await mailService.resetVerifyCode(verificationId, newCode)

        let checkConfirmCode = await mailService.checkConirmCodeStatus(verificationId)

        if (checkConfirmCode) {

            let till_timout = (60 - ((new Date().getTime() - checkConfirmCode.updatedAt.getTime()) / 1000))

            return res.status(200).json({
                message: "Kiritilgan email pochtaga yangi sms kodi yuborildi!",
                is_active: true,
                till_timout: Math.ceil(till_timout)
            })
        }
    }
    catch (err) {
        next()
    }
}

