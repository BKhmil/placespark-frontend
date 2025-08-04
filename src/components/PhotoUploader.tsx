import type { ChangeEvent } from 'react';
import React, { useState } from 'react';

interface PhotoUploaderProps {
	label?: string;
	initialPhoto?: string;
	uploadFn: (file: File) => Promise<any>;
	onSuccess?: (res: any) => void;
	onError?: (err: any) => void;
	accept?: string;
	className?: string;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
	label = 'Фото',
	initialPhoto = '',
	uploadFn,
	onSuccess,
	onError,
	accept = 'image/*',
	className = '',
}) => {
	const [photoPreview, setPhotoPreview] = useState<string>(initialPhoto);
	const [photoFile, setPhotoFile] = useState<File | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const inputId = 'photo-uploader-input';

	const onPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setPhotoFile(file);
			setPhotoPreview(URL.createObjectURL(file));
			setError(null);
			setSuccess(false);
		}
	};

	const handleUpload = async () => {
		if (!photoFile) return;
		setIsLoading(true);
		setError(null);
		setSuccess(false);
		try {
			const res = await uploadFn(photoFile);
			setSuccess(true);
			onSuccess?.(res);
		} catch (err: any) {
			setError(err?.message || 'Помилка завантаження');
			onError?.(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			{label && (
				<label
					htmlFor={inputId}
					className='font-medium text-gray-700 dark:text-gray-200'
				>
					{label}
				</label>
			)}
			<input
				id={inputId}
				type='file'
				accept={accept}
				onChange={onPhotoChange}
				className='input'
				title={label}
				placeholder={label}
			/>
			{photoPreview && (
				<div className='mt-2'>
					<img
						src={photoPreview}
						alt='preview'
						className='w-24 h-24 rounded-full object-cover border'
					/>
				</div>
			)}
			<button
				type='button'
				className='btn btn-primary'
				onClick={handleUpload}
				disabled={isLoading || !photoFile}
			>
				{isLoading ? 'Завантаження...' : 'Завантажити'}
			</button>
			{success && <div className='text-green-600'>Фото оновлено!</div>}
			{error && <div className='text-red-500'>{error}</div>}
		</div>
	);
};

export default PhotoUploader;
