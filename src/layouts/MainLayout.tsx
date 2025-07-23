import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

const MainLayout = () => (
	<div className='min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors'>
		<Header />
		<main className='flex-1 py-4 px-2 sm:px-4 pt-8'>
			<Outlet />
		</main>
		<Footer />
	</div>
);

export default MainLayout;
