import express from 'express'
import cors from 'cors'

// imports
import auth from "./auth"

const router = express()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))
router.use(cors())

router.use('/auth', auth)

export default router

