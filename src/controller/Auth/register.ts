import {
    NextFunction,
    Request,
    Response,
    authService,
    messagesConfig,
    UserRegisterDto,
    uuid, mailSender, Role, mailService
} from "../../imports";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        let userData: UserRegisterDto = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            verificationId: uuid()
        }

        let isExicted = await authService.findUserByMail(userData.email)

        if (!isExicted || isExicted.role === Role.NOT_VERIFIED) {

            if(isExicted) {
                await authService.deleteUser(isExicted.id)
            }
            
            // user registering
            await authService.userRegister(userData)

            let mailsender = await mailSender(req, res, next, userData)

            if(!mailsender) return res.status(403).send({
                message: `error occured in mailSender() part!`
            })

            await mailService.addConfirmCode(Number(mailsender.text), userData.verificationId)

            return res.status(200).json({
                message: messagesConfig.confirmCode,
            })
        }

        return res.status(403).send({
            message: messagesConfig.alreadyExicted(userData.email),
            is_active: false
        })
    }
    catch (err) {
        console.log(err);
        next()
    }
}

