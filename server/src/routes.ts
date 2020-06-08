import express from 'express'
import multer from 'multer'

import multerConfig from './config/multer'

const upload = multer(multerConfig)

const routes = express.Router()

import ItemController from './controllers/ItemController'
import PointController from './controllers/PointController'

routes.get('/items', ItemController.index)

routes.post('/points', upload.single('image'), PointController.store)
routes.get('/points/:id', PointController.show)
routes.get('/points', PointController.index)

export default routes