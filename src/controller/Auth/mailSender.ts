import { 
    Request, 
    Response, 
    NextFunction, 
    messagesConfig,
    nodeMailer, mailConfig, 
    UserRegisterDto, 
} from "../../imports";

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

        // set direction config
        const mail_configs = {
            from: mailConfig.myMail,
            to: `${userData.email}`,
            subject: `${mailConfig.sendingMailSubject}`,
            text: `${Math.ceil(Math.random() * (9999 - 1000 + 1) + 1000)}`
        }

        // sending mail to client!
        transporter.sendMail(mail_configs, async function (error, info) {
            if (error) {
                console.log(error);
                res.status(403).send({
                    message: messagesConfig.sendMailerError
                })
            }
        })

        return mail_configs;
        
    } catch (err) {
        console.log(err);
        next()
    }
}


