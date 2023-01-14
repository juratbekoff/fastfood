import { Router } from 'express'
import { register, verify, resetCode } from '../../controller/Auth/'
import setMaps from "../../controller/setMaps"

const router = Router()

router
    .post('/register', register)
    .post('/verify', verify)
    .post('/reset', resetCode)
    .post('/set', setMaps)


export default router