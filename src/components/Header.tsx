import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/rtk';
import LanguageSwitcher from './LanguageSwitcher';
import LogoutModal from './LogoutModal';
import ThemeSwitcher from './ThemeSwitcher';

const Header = () => {
	const { t } = useTranslation();
	const { isAuthenticated, user } = useAppSelector((state) => state.user);
	const [logoutOpen, setLogoutOpen] = useState(false);

	// Reset logout modal on user or auth state change
	// cuz previously I had a bug when the modal was open when the user was
	// successfully registered
	useEffect(() => {
		setLogoutOpen(false);
	}, [user?._id, isAuthenticated]);

	return (
		<header className='sticky top-0 left-0 z-40 w-full transition-colors shadow-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur'>
			<div className='flex flex-col items-center justify-between gap-2 p-4 md:flex-row md:gap-0'>
				<nav className='flex gap-4'>
					<Link to='/' className='text-lg font-bold'>
						{t('header.app_name')}
					</Link>
					<Link to='/top' className='hover:underline'>
						{t('header.top')}
					</Link>
					<Link to='/piyachok' className='hover:underline'>
						{t('header.piyachok')}
					</Link>
					<Link to='/news' className='hover:underline'>
						{t('header.news')}
					</Link>
				</nav>
				<div className='flex items-center gap-2'>
					<LanguageSwitcher />
					<ThemeSwitcher />
					{isAuthenticated && user ? (
						<>
							<Link
								to='/profile'
								className='flex items-center gap-2 px-3 py-1 bg-gray-100 rounded dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
							>
								<span className='text-xl'>👤</span>
								<span className='hidden sm:inline'>{user.name}</span>
							</Link>
							<button
								type='button'
								className='px-2 py-1 text-red-600 transition bg-red-100 rounded dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
								onClick={() => setLogoutOpen(true)}
								aria-label='Logout'
							>
								⎋
							</button>
							<LogoutModal
								open={logoutOpen}
								onClose={() => setLogoutOpen(false)}
							/>
						</>
					) : (
						<>
							<Link
								to='/auth/sign-in'
								className='px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600'
							>
								{t('header.sign_in')}
							</Link>
							<Link
								to='/auth/sign-up'
								className='px-3 py-1 bg-gray-100 rounded dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
							>
								{t('header.sign_up')}
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
