import { type FC } from 'react';

interface PaginationProps {
	page: number;
	total: number;
	pageSize: number;
	onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
	page,
	total,
	pageSize,
	onPageChange,
}) => {
	const totalPages = Math.ceil(total / pageSize);
	const currentBlock = Math.floor((page - 1) / 10);
	const startPage = currentBlock * 10 + 1;
	const endPage = Math.min(startPage + 9, totalPages);

	const canPrevBlock = startPage > 1;
	const canNextBlock = endPage < totalPages;

	const handlePrevBlock = () => {
		if (canPrevBlock) onPageChange(startPage - 1);
	};
	const handleNextBlock = () => {
		if (canNextBlock) onPageChange(endPage + 1);
	};

	return (
		<div className='flex items-center justify-center gap-2 mt-8 select-none'>
			<button
				className='flex items-center justify-center text-gray-700 transition bg-gray-200 rounded-full w-9 h-9 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50'
				onClick={handlePrevBlock}
				disabled={!canPrevBlock}
				aria-label='Previous block'
				type='button'
			>
				<span className='text-xl'>&#8592;</span>
			</button>
			{Array.from({ length: endPage - startPage + 1 }, (_, i) => {
				const p = startPage + i;
				return (
					<button
						key={p}
						className={`w-9 h-9 flex items-center justify-center rounded-full border transition font-semibold text-base
              ${
								p === page
									? 'border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900 underline'
									: 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'
							}`}
						onClick={() => onPageChange(p)}
						aria-current={p === page ? 'page' : undefined}
						type='button'
					>
						{p}
					</button>
				);
			})}
			<button
				className='flex items-center justify-center text-gray-700 transition bg-gray-200 rounded-full w-9 h-9 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50'
				onClick={handleNextBlock}
				disabled={!canNextBlock}
				aria-label='Next block'
				type='button'
			>
				<span className='text-xl'>&#8594;</span>
			</button>
		</div>
	);
};

export default Pagination;
