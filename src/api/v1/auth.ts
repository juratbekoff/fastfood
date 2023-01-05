import { Router } from 'express'
import { register, verify } from '../../controller/Auth/'

const router = Router()

router
    .post('/register', register)
    .post('/verify', verify)

export default router