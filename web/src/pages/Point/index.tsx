import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import axios from 'axios'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'

import './styles.css'

import logo from '../../assets/logo.svg'
import item from '../../assets/items/baterias.svg'

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

const Point: React.FC = () => {
	const history = useHistory()

	const [ufs, setUfs] = useState<string[]>([])
	const [cities, setCities] = useState<string[]>([])
	const [selectedUf, setSelectedUf] = useState<string>('0')
	const [selectedCity, setSelectedCity] = useState<string>('0')
	const [selectedMarkerPosition, setSelectedMarkerPosition] = useState<[number, number]>([0, 0])
	const [initialMapPosition, setInitialMapPosition] = useState<[number, number]>([0, 0])
	const [data, setData] = useState<Data>({} as Data)
	const [selectedItems, setSelectedItems] = useState<number[]>([])

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

	function handleSubmit(event: FormEvent) {
		event.preventDefault()

		const [latitude, longitude] = selectedMarkerPosition

		const createData = {
			...data,
			uf: selectedUf,
			city: selectedCity,
			items: selectedItems,
			latitude,
			longitude
		}

		alert('Ponto de coleta cadastrado!')

		history.push('/')
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
						<li 
							onClick={() => handleSelectItem(1)} 
							className={selectedItems.includes(1) ? 'selected' : ''}
						>
							<img src={item} alt="Pilhas e baterias"/>
							<span>Pilhas e baterias</span>
						</li>
				
						<li 
							onClick={() => handleSelectItem(2)}
							className={selectedItems.includes(2) ? 'selected' : ''}
						>
							<img src={item} alt="Pilhas e baterias"/>
							<span>Pilhas e baterias</span>
						</li>

						<li 
							onClick={() => handleSelectItem(3)}
							className={selectedItems.includes(3) ? 'selected' : ''}
						>
							<img src={item} alt="Pilhas e baterias"/>
							<span>Pilhas e baterias</span>
						</li>

						<li 
							onClick={() => handleSelectItem(4)}
							className={selectedItems.includes(4) ? 'selected' : ''}
						>
							<img src={item} alt="Pilhas e baterias"/>
							<span>Pilhas e baterias</span>
						</li>

						<li 
							onClick={() => handleSelectItem(5)}
							className={selectedItems.includes(5) ? 'selected' : ''}
						>
							<img src={item} alt="Pilhas e baterias"/>
							<span>Pilhas e baterias</span>
						</li>

						<li 
							onClick={() => handleSelectItem(6)}
							className={selectedItems.includes(6) ? 'selected' : ''}
						>
							<img src={item} alt="Pilhas e baterias"/>
							<span>Pilhas e baterias</span>
						</li>
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