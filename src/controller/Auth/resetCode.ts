import { 
    NextFunction, 
    Request, 
    Response, 
    authService, 
    mailService,
    messagesConfig,
    mailSender
} from "../../helpers/imports";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {

        let { verificationId } = req.body

        // finding user by verification ID
        let findUserByVerifyId = await authService.findUserForResend(String(verificationId))

        // checking verificationId for re-send mail to client
        if (!findUserByVerifyId) {
            return res.status(403).send({
                message: messagesConfig.resendingError
            })
        }

        let mailsender = await mailSender(req, res, next, findUserByVerifyId)

        // adding resent code to database for next operations for litle time
        await mailService.resetVerifyCode(verificationId, Number(mailsender?.text) )

        // checking confirm code
        let checkConfirmCode = await mailService.checkConirmCodeStatus(verificationId)

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

