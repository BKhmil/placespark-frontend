import { type TFunction } from 'i18next';
import React from 'react';
import { type IPlace } from '../interfaces/place.interface';

interface IEstablishmentCardProps {
	place: IPlace;
	t: TFunction;
}

const EstablishmentCard: React.FC<IEstablishmentCardProps> = ({ place, t }) => (
	<div className='flex flex-col justify-between w-[300px] h-80 max-h-80 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-transform duration-150 overflow-hidden group'>
		<div>
			<div className='flex items-center justify-center w-24 h-24 mb-5 text-3xl text-gray-400 bg-gray-200 rounded-full dark:bg-gray-700 mx-auto overflow-hidden'>
				{place.photo ? (
					<img
						src={place.photo}
						alt={place.name}
						className='object-cover w-full h-full rounded-full transition-transform duration-150 group-hover:scale-110'
					/>
				) : (
					'🏠'
				)}
			</div>
			<div className='mb-1 text-xl font-bold text-center text-gray-900 dark:text-white'>
				{place.name}
			</div>
			<div className='mb-1 text-sm text-center text-gray-500 dark:text-gray-400'>
				{place.address}
			</div>
			<div className='mb-2 text-xs text-center text-gray-400'>
				{t(`establishments.type.${place.type}`, place.type)}
			</div>
			<div className='flex flex-wrap justify-center gap-2 mb-3'>
				{place.features.map((f: string) => (
					<span
						key={f}
						className='px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded text-xs'
					>
						{t(`establishments.feature.${f}`, f)}
					</span>
				))}
			</div>
			<div className='flex items-center justify-center gap-1 mb-4 text-base font-semibold text-yellow-500'>
				<span>★</span>
				<span>{place.rating.toFixed(1)}</span>
			</div>
		</div>
		<button className='px-5 py-2 mt-4 text-sm font-medium text-white transition bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800'>
			{t('establishments.details', 'Details')}
		</button>
	</div>
);

export default EstablishmentCard;
