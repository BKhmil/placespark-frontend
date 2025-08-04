import { useTheme } from '../hooks/useTheme';

const ThemeSwitcher = () => {
	const [theme, toggleTheme] = useTheme();

	return (
		<button
			type='button'
			onClick={toggleTheme}
			className='px-2 py-1 bg-gray-200 rounded dark:bg-gray-700'
			aria-label='Перемкнути тему'
		>
			{theme === 'dark' ? '🌙' : '☀️'}
		</button>
	);
};

export default ThemeSwitcher;
