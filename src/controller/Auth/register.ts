import { AuthService, MailService } from "../../service/";
import { Request, Response, NextFunction } from "express"
import { UserRegisterDto } from "../../dtos";
import nodeMailer from "nodeMailer"
import { mailConfig } from '../../configs'

const authService = new AuthService()
const mailService = new MailService()

export default async (req: Request, res: Response, next: NextFunction) => {
    try {

        let userData: UserRegisterDto = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }

        let isExictedUser = await authService.findUserByMail(userData.email)
        
        if (isExictedUser) {
            return res.status(403).send({
                message: `this email already exicted! Please, use another email!`
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
            to: `${userData.email}`,
            subject: `Testing`,
            text: `${Math.ceil(Math.random() * 10000)}`
        }

        transporter.sendMail(mail_configs, async function (error, info) {
            if (error) {
                console.log(error);
                return res.send("error occured!")
            }
            
            // user registering
            await authService.userRegister(userData)

            let findUser = await authService.findUserByMail(userData.email)

            // add confirmation code to the database for some seconds
            await mailService.addConfirmCode(Number(mail_configs.text), findUser?.verificationId!)

            return res.status(200).json({
                message: `Kiritiligan email manziliga yuborilgan tasdiqlash kodini kiriting!`,
            })
        })
    }
    catch (err) {
        next()
    }
}
