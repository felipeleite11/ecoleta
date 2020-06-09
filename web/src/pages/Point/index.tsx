import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import axios from 'axios'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import Dropzone from '../../components/Dropzone'
import api from '../../services/api'

import './styles.css'

import logo from '../../assets/logo.svg'

interface IBGEUFResponse {
	sigla: string
}

interface IBGECityResponse {
	nome: string
}

interface Data {
	name: string
	email: string
	whatsapp: string
}

interface Item {
	id: number
	title: string
	image_url: string
}

const Point: React.FC = () => {
	const history = useHistory()

	const [ufs, setUfs] = useState<string[]>([])
	const [cities, setCities] = useState<string[]>([])
	const [items, setItems] = useState<Item[]>([])
	const [selectedUf, setSelectedUf] = useState<string>('0')
	const [selectedCity, setSelectedCity] = useState<string>('0')
	const [selectedMarkerPosition, setSelectedMarkerPosition] = useState<[number, number]>([0, 0])
	const [initialMapPosition, setInitialMapPosition] = useState<[number, number]>([0, 0])
	const [data, setData] = useState<Data>({} as Data)
	const [selectedItems, setSelectedItems] = useState<number[]>([])
	const [selectedFile, setSelectedFile] = useState<File>()

	useEffect(() => {
		axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
			.then(response => {
				const serialized = response.data.map(uf => uf.sigla)
				
				setUfs(serialized)
			})
	}, [])

	useEffect(() => {
		axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
			.then(response => {
				const serialized = response.data.map(uf => uf.nome)

				setCities(serialized)
			})
	}, [selectedUf])

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(position => {
			const { latitude, longitude } = position.coords

			setInitialMapPosition([latitude, longitude])
		})
	}, [])

	useEffect(() => {
		api.get('/items').then(response => setItems(response.data))
	}, [])

	function handleUFChange(event: ChangeEvent<HTMLSelectElement>) {
		const value = event.target.value

		setSelectedUf(value)
	}

	function handleCityChange(event: ChangeEvent<HTMLSelectElement>) {
		const value = event.target.value

		setSelectedCity(value)
	}

	function handleMapClick(event: LeafletMouseEvent) {
		const { lat, lng } = event.latlng

		setSelectedMarkerPosition([lat, lng])
	}

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target
		
		setData({
			...data,
			[name]: value
		})
	}

	function handleSelectItem(id: number) {
		const selected = selectedItems.includes(id)

		if(selected) {
			setSelectedItems(selectedItems.filter(item => item !== id))
		} else {
			setSelectedItems([
				...selectedItems,
				id
			])
		}
	}

	async function handleSubmit(event: FormEvent) {
		event.preventDefault()

		const [latitude, longitude] = selectedMarkerPosition
		const { name, email, whatsapp } = data

		const createData = new FormData()

		createData.append('name', name)
		createData.append('email', email)
		createData.append('whatsapp', whatsapp)
		createData.append('uf', selectedUf)
		createData.append('city', selectedCity)
		createData.append('items', selectedItems.join(','))
		createData.append('latitude', String(latitude))
		createData.append('longitude', String(longitude))
		
		if(selectedFile) {
			createData.append('image', selectedFile)
		}

		try {
			await api.post('/points', createData)

			alert('Ponto de coleta cadastrado!')

			history.push('/')
		} catch(e) {
			alert('Preencha corretamente')
		}
	}

	return (
		<div id="page-create-point">
			<header>
				<img src={logo} alt="Ecoleta"/>

				<Link to="/">
					<FiArrowLeft />
					Voltar para Home
				</Link>
			</header>

			<form onSubmit={handleSubmit}>
				<h1>Cadastro do<br/>ponto de coleta</h1>

				<Dropzone onFileUpload={setSelectedFile} />

				<fieldset>
					<legend>
						<h1>Dados</h1>
					</legend>

					<div className="field">
						<label htmlFor="name">Nome da entidade</label>

						<input 
							type="text" 
							id="name" 
							name="name" 
							onChange={handleInputChange}
						/>
					</div>

					<div className="field-group">
						<div className="field">
							<label htmlFor="email">E-mail</label>
							<input 
								type="email"
								name="email"
								id="email"
								onChange={handleInputChange}
							/>
						</div>

						<div className="field">
							<label htmlFor="whatsapp">Whatsapp</label>
							<input 
								type="text"
								name="whatsapp"
								id="whatsapp"
								onChange={handleInputChange}
							/>
						</div>
					</div>

				</fieldset>

				<fieldset>
					<legend>
						<h1>Endereço</h1>
						<span>Selecione o endereço no mapa</span>
					</legend>

					<Map 
						center={initialMapPosition} 
						zoom={17}
						onClick={handleMapClick}
					>
						<TileLayer
							attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        				/>

						<Marker position={selectedMarkerPosition} />
					</Map>

					<div className="field-group">
						<div className="field">
							<label htmlFor="uf">UF</label>
							<select name="uf" id="uf" value={selectedUf} onChange={handleUFChange}>
								<option value="0">Selecione...</option>

								{ufs.map(uf => (
									<option key={uf} value={uf}>{uf}</option>
								))}
							</select>
						</div>

						<div className="field">
							<label htmlFor="city">Município</label>
							<select name="city" id="city" value={selectedCity} onChange={handleCityChange}>
								<option value="0">Selecione...</option>
								
								{cities.map(city => (
									<option key={city} value={city}>{city}</option>
								))}
							</select>
						</div>
					</div>
				</fieldset>

				<fieldset>
					<legend>
						<h1>Itens de coleta</h1>
						<span>Selecione um ou mais itens abaixo</span>
					</legend>

					<div className="items-grid">

						{items && items.map(item => (
							<li 
								key={item.id}
								onClick={() => handleSelectItem(item.id)} 
								className={selectedItems.includes(item.id) ? 'selected' : ''}
							>
								<img src={item.image_url} alt={item.title} />
								<span>{item.title}</span>
							</li>
						))}
					</div>
				</fieldset>

				<button type="submit">
					Cadastrar ponto de coleta
				</button>

			</form>

		</div>
	)
}

export default Point