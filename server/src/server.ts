import express from 'express'
import { resolve } from 'path'
import cors from 'cors'

import routes from './routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(resolve(__dirname, '..', 'uploads')))
app.use(routes)

app.listen(3333, () => console.log('Executando em http://localhost:3333'))