import { Request } from 'express'
import multer, {  } from 'multer'
import { resolve } from 'path'
import crypto from 'crypto'

interface File {
	mimetype: string
}

export default {
	storage: multer.diskStorage({
		destination: resolve(__dirname, '..', '..', 'uploads'),
		filename(req, file, cb) {
			const hash = crypto.randomBytes(6).toString('hex')
			
			const filename = `${hash}-${file.originalname}`
			
			cb(null, filename)
		}
	}),
	limits: {
		fileSize: 5 * 1024 * 1024
	}
}