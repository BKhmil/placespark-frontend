import { type TFunction } from 'i18next';
import { type FC } from 'react';
import EstablishmentCard from './EstablishmentCard';
import type {IPlace} from "../interfaces/place.interface.ts";

interface IEstablishmentsGridProps {
	data: IPlace[];
	t: TFunction;
	minHeight?: string;
}

const EstablishmentsGrid: FC<IEstablishmentsGridProps> = ({
	data,
	t,
	minHeight,
}) => (
	<div
		className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto min-h-[70vh] px-2 sm:px-4 md:px-8 items-stretch'
		style={{ minHeight }}
	>
		{data.map((place) => (
			<EstablishmentCard key={place._id} place={place} t={t} />
		))}
	</div>
);

export default EstablishmentsGrid;
