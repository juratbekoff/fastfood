import { Router } from 'express'
import { register, verify, resetCode } from '../../controller/Auth/'

const router = Router()

router
    .post('/register', register)
    .post('/verify', verify)
    .post('/reset', resetCode)

export default router