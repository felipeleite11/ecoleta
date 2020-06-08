<h1 align="center">WEB app with NodeJS + ReactJS</h1>

This project implements a web app to store garbage collect points, using ReactJS, Typescript, Knex Query Builder, Multer and SQLite.

<p align="center">
	<img src="https://user-images.githubusercontent.com/54327441/84082021-7c6e4e80-a9b5-11ea-9f82-18a5f15f05f9.png" height="78" width="308" alt="Demo screen" />
</p>

<h2>Environment requirements</h2>

- [NodeJS](https://nodejs.org) with the [NPM](https://www.npmjs.com) package manager installed.
- Install the [Yarn](https://yarnpkg.com) if you prefer to use it.

<h2>Required NPM packages</h2>

|  Module    | Purpose                                                   |
| -------------------------: | ----------------------------------------- |
| `Express`  | Create a web server to serve statically the game pages    |
| `Knex`     | Query builder to manage the database and queries          |
| `SQLite 3` | Databse file-based to store data                          |


<h2>Features</h2>

- Store garbage collect points
- Position selection on map
- Search for states and cities from the IBGE API
- Image upload on drop file


<h2>Get started</h2>

1. Clone this project: `git clone https://github.com/felipeleite11/ecoleta.git`
2. Enter in `server` directory
	1. Execute `npm install` or `yarn` to install dependencies
	2. Execute `npm start` or `yarn start` to run the server (API)
3. Enter in `web` directory
	1. Execute `npm install` or `yarn` to install dependencies
	2. Execute `npm start` or `yarn start` to run the web app (this will automatically open `http://localhost:3333` in your default browser)
5. Try the app
