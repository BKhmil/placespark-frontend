import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

export const useTheme = (): [Theme, () => void] => {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window !== 'undefined') {
			return (
				(localStorage.getItem('theme') as Theme) ||
				(window.matchMedia('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light')
			);
		}
		return 'light';
	});

	useEffect(() => {
		const root = window.document.documentElement;
		if (theme === 'dark') {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
		localStorage.setItem('theme', theme);
	}, [theme]);

	const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

	return [theme, toggleTheme];
}
