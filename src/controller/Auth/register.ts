import {
    NextFunction,
    Request,
    Response,
    authService,
    messagesConfig,
    UserRegisterDto,
    uuid, mailSender, Role, mailService
} from "../../helpers/imports";

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

            let test = await mailSender(req, res, next, userData)

            await mailService.addConfirmCode(Number(test?.text), userData.verificationId)

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

