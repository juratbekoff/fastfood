import express from 'express'
import cors from 'cors'
import api from "./api"

import { serverConfig } from './configs'

express()
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cors())

    .use('/api', api )

    .listen(serverConfig.port, () => {
        serverConfig.info()
    })

