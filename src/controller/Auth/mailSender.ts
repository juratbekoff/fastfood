import { 
    Request, 
    Response, 
    NextFunction, 
    messagesConfig,
    nodeMailer, mailConfig, 
    UserRegisterDto, 
    mailService
} from "../../imports/";

export default async (req: Request, res: Response, next: NextFunction, userData: UserRegisterDto) => {
    try {
        
        // mail sender configuration
        let transporter = nodeMailer.createTransport({
            host: mailConfig.mailHost,
            port: 465,
            secure: true,
            service: mailConfig.mailService,
            auth: {
                user: mailConfig.myMail,
                pass: mailConfig.myPassword
            }
        })

        // sent direction config
        const mail_configs = {
            from: mailConfig.myMail,
            to: `${userData.email}`,
            subject: `Testing SMS`,
            text: `${Math.ceil(Math.random() * (9999 - 1000 + 1) + 1000)}`
        }

        // sending sms to client!
        transporter.sendMail(mail_configs, async function (error, info) {
            if (error) {
                console.log(error);
                res.status(403).send({
                    message: messagesConfig.sendMailerError
                })
            }
        })

        // adding sms code to database
        await mailService.addConfirmCode(Number(mail_configs.text), userData.verificationId)

        // returning final response
        return res.status(200).json({
            message: messagesConfig.confirmCode,
        })
    } catch (error) {
        console.log(error);
        next()
    }
}


