import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Home from './pages/Home'
import Point from './pages/Point'

const Routes: React.FC = () => {
	return (
		<BrowserRouter>
			<Route path="/" component={Home} exact />
			<Route path="/cadastro" component={Point} />
		</BrowserRouter>
	)
}

export default Routes