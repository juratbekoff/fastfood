import { 
    NextFunction, 
    Request, 
    Response, 
    authService, 
    mailService, mailConfig,
    nodeMailer,
    messagesConfig
} from "../../imports/";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {

        // inital config for resend
        let { verificationId } = req.body

        // generatin new code
        let newCode = Math.ceil(Math.random() * (9999 - 1000 + 1) + 1000)

        // finding user by verification ID
        let findUserByVerifyId = await authService.findUserByVerifyId(String(verificationId))

        // checking verificationId for re-send mail to client
        if (!findUserByVerifyId) {
            return res.status(403).send({
                message: messagesConfig.resendingError
            })
        }

        // nodemailer config
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

        // sent direction config
        const mail_configs = {
            from: mailConfig.myMail,
            to: `${findUserByVerifyId.email}`,
            subject: `Test sms!`,
            text: `${newCode}`
        }
        // resend code to client!
        transporter.sendMail(mail_configs, async function (error, info) {
            if (error) {
                console.log(error);
                return res.send("error occured!")
            }
            console.log(info.response);
        })

        // adding resent code to database for next operations for litle time
        await mailService.resetVerifyCode(verificationId, newCode)

        // checking confirm code
        let checkConfirmCode = await mailService.checkConirmCodeStatus(verificationId)

        // if has, return response
        if (checkConfirmCode) {
            
            // time remaining until expiration
            let till_timout = (60 - ((new Date().getTime() - checkConfirmCode.updatedAt.getTime()) / 1000))

            // returning response 200 OK
            return res.status(200).json({
                message: messagesConfig.newConfirmCode,
                is_active: true,
                till_timout: Math.ceil(till_timout)
            })
        }
    }
    catch (err) {
        console.log(err);
        next()
    }
}

