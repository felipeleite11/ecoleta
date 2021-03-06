import { Request, Response } from 'express'

import knex from '../database/connection'

class ItemController {
	async index(req: Request, res: Response) {
		const items = await knex('items').select('*')

		const serialized = items.map(item => ({
			id: item.id,
			title: item.title,
			image_url: `http://localhost:3333/uploads/${item.image}`
		}))

		return res.json(serialized)
	}
}

export default new ItemController()
