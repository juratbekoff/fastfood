import { 
    NextFunction, 
    Request, 
    Response, 
    authService, 
    messagesConfig,
    UserRegisterDto,
    uuid, mailSender, Role
} from "../../imports/";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userData: UserRegisterDto = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            verificationId: uuid()
        }
        let isExicted = await authService.findUserByMail(userData.email)
                
        if (!isExicted) {
            // user registering
            await authService.userRegister(userData)
                return mailSender(req, res, next, userData)
        }
        if (isExicted?.role === Role.NOT_VERIFIED) {
            return mailSender(req, res, next, userData)
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
