import { 
    verifyService, 
    NextFunction, 
    Request, 
    Response, 
    VerifyDto, 
    authService, 
    jwt, jwtConfig, 
    mailService, messagesConfig 
} from "../../helpers/imports";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {

        let data: VerifyDto = {
            verificationId: req.body.verificationId,
            code: req.body.code
        }

        let isAlreadyRegistreted = await authService.findUserByVerifyId(data.verificationId)

        if(isAlreadyRegistreted?.is_verified) {
            return res.status(403).json({
                message: messagesConfig.alreadyExicted(isAlreadyRegistreted.email),
                is_active: false
            })
        }

        let checkEnteredConfirmCode = await mailService.checkConirmCode(String(data.verificationId), +data.code)

        if (!checkEnteredConfirmCode) {            
            return res.status(403).send({
                message: messagesConfig.wrongEnteredData,
                is_active: false,
            })
        }

        // setting timout for verifying
        let timOut = ((new Date().getTime() - checkEnteredConfirmCode.updatedAt.getTime()) / 1000) > 60

        // the time untill finishing verifying
        let till_timout = (60 - ((new Date().getTime() - checkEnteredConfirmCode.updatedAt.getTime()) / 1000))

        // if time is up, if statement started below
        if (timOut) {
            await mailService.setMailState(checkEnteredConfirmCode.id)
                return res.status(403).send({
                    message: messagesConfig.oldConfirmCode,
                    is_active: false,
                })
        }

        const jsontoken = jwt.sign({ result: data }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn })

        let getCreatedUser = await authService.findUserByVerifyId(data.verificationId)

        if (getCreatedUser) {

            await verifyService.verifyingUser(getCreatedUser.id)

            return res.status(200).json({
                message: `Welcome!`,
                is_active: true,
                till_timout: Math.ceil(till_timout),
                user: getCreatedUser,
                token: jsontoken
            })
        }

        return res.status(500).send({
            messsage: messagesConfig.ISE
        })
    }
    catch (err) {
        console.log(err);
        next(err)
    }
}
