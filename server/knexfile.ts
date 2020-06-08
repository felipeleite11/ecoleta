import { resolve } from 'path'

module.exports = {
	client: 'sqlite3',
	useNullAsDefault: true,
	connection: {
		filename: resolve(__dirname, 'src', 'database', 'database.sqlite')
	},
	migrations: {
		directory: resolve(__dirname, 'src', 'database', 'migrations')
	},
	seeds: {
		directory: resolve(__dirname, 'src', 'database', 'seeds')
	}
}