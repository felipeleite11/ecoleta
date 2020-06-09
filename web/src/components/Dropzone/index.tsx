import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'

import './styles.css'

interface DropzoneProps {
	onFileUpload: (file: File) => void
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileUpload }) => {
	const [selectedFileURL, setSelectedFileURL] = useState('')

	const onDrop = useCallback(acceptedFiles => {
		const file = acceptedFiles[0]

		const fileURL = URL.createObjectURL(file)

		setSelectedFileURL(fileURL)

		onFileUpload(file)
	}, [onFileUpload])

	const { getRootProps, getInputProps } = useDropzone({ 
		onDrop,
		accept: 'image/*'
	})

	return (
		<div {...getRootProps()} className="dropzone">
			<input {...getInputProps()} accept="image/*" />

			{selectedFileURL ? (
				<img src={selectedFileURL} alt="Thumbnail" />
			) : (
				<p>
					<FiUpload />
					Arraste ou selecione a imagem do estabelecimento
				</p>
			)}
		</div>
	)
}

export default Dropzone