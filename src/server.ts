import express from 'express'
import cors from 'cors'
import api from "./api"

import { serverConfig } from './configs'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api', api )

app.listen(serverConfig.port, () => {
    console.log(`Server running on http://localhost:${serverConfig.port}`)
})
