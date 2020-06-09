import express from 'express'
import multer from 'multer'
import { celebrate, Joi, Segments } from 'celebrate'

import multerConfig from './config/multer'

const upload = multer(multerConfig)

const routes = express.Router()

import ItemController from './controllers/ItemController'
import PointController from './controllers/PointController'

routes.get('/items', ItemController.index)

routes.get('/points/:id', PointController.show)
routes.get('/points', PointController.index)
routes.post(
	'/points', 
	upload.single('image'),
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			name: Joi.string().required(),
			email: Joi.string().required().email(),
			whatsapp: Joi.string().required(),
			latitude: Joi.number().required(),
			longitude: Joi.number().required(),
			city: Joi.string(),
			uf: Joi.string().length(2) ,
			items: Joi.string().required().regex(/[0-9,]+/)
		})
	}, {
		abortEarly: false
	}), 
	PointController.store
)

export default routes