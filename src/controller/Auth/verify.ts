import { 
    verifyService, 
    NextFunction, 
    Request, 
    Response, 
    VerifyDto, 
    authService, 
    jwt, jwtConfig, 
    mailService, messagesConfig 
} from "../../imports/";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {

        // accepting data from request's body
        let data: VerifyDto = {
            verificationId: req.body.verificationId,
            code: req.body.code
        }

        // checking the user verified registreted
        let isAlreadyRegistreted = await authService.findUserByVerifyId(data.verificationId)

        // if has, return excisted
        if(isAlreadyRegistreted?.is_verified) {
            return res.status(403).json({
                message: messagesConfig.alreadyExicted(isAlreadyRegistreted.email),
                is_active: false
            })
        }
        // checking entered confirm code for verify
        let checkEnteredConfirmCode = await mailService.checkConirmCode(String(data.verificationId), +data.code)

        // if become error, work if statement  
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

        // setting up jwt for registering
        const jsontoken = jwt.sign({ result: data }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn })

        // getting user from database for verifying
        let getCreatedUser = await authService.findUserByVerifyId(data.verificationId)

        // if user has, operation will start into the if statement called getCreatedUser
        if (getCreatedUser) {

            // in here, user verified by his ID
            await verifyService.verifyingUser(getCreatedUser.id)

            // in here, deleted all inActive mails for cleaning database from trush
            await mailService.deleteInActiveMails()

            // in finally, returning response 200 OK
            return res.status(200).json({
                message: `Welcome!`,
                is_active: true,
                till_timout: Math.ceil(till_timout),
                user: getCreatedUser,
                token: jsontoken
            })
        }

        // if none of the codes do not work above, returning final respone as an INternal Server Error!
        return res.status(500).send({
            messsage: messagesConfig.ISE
        })
    }
    catch (err) {
        next()
    }
}
