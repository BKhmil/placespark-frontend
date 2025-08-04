import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/rtk';
import { RoleEnum } from '../enums/role.enum';

const profileMenu = [
	{
		path: '/profile',
		label: 'profile.menu.main',
		roles: [RoleEnum.USER, RoleEnum.ESTABLISHMENT_ADMIN, RoleEnum.CRITIC, RoleEnum.SUPERADMIN],
	},
	{
		path: '/profile/my-places',
		label: 'profile.menu.my_places',
		roles: [RoleEnum.ESTABLISHMENT_ADMIN, RoleEnum.SUPERADMIN],
	},
	{
		path: '/profile/create-place',
		label: 'profile.menu.create_place',
		roles: [RoleEnum.ESTABLISHMENT_ADMIN, RoleEnum.SUPERADMIN],
	},
	{
		path: '/profile/favorites',
		label: 'profile.menu.favorites',
		roles: [RoleEnum.USER, RoleEnum.CRITIC],
	},
	{
		path: '/profile/security',
		label: 'profile.menu.security',
		roles: [RoleEnum.USER, RoleEnum.ESTABLISHMENT_ADMIN, RoleEnum.CRITIC, RoleEnum.SUPERADMIN],
	},
	{
		path: '/profile/admin',
		label: 'profile.menu.admin',
		roles: [RoleEnum.SUPERADMIN],
	},
];

function RequireProfileRole({ children }: { children: ReactNode }) {
	const { user } = useAppSelector((s) => s.user);
	const location = useLocation();
	const role = user?.role as RoleEnum;
	const current = profileMenu.find((item) => location.pathname === item.path);
	if (current && (!role || !current.roles.includes(role))) {
		return <Navigate to='/profile' replace />;
	}
	return <>{children}</>;
}

export default function ProfileLayout() {
	const { t } = useTranslation();
	const { user } = useAppSelector((s) => s.user);
	const location = useLocation();
	const role = user?.role as RoleEnum;
	return (
		<div className='flex flex-col md:flex-row w-full min-h-[80vh] bg-white dark:bg-gray-900 rounded-xl shadow'>
			<aside className='w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-0 md:p-6'>
				<div className='flex flex-col items-center py-6 md:py-0 md:items-start'>
					{/* Видаляю блок з аватаркою */}
					{/* <div className='w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-3xl mb-2'>
						<span>👤</span>
					</div> */}
					<div className='font-semibold text-lg mb-1 text-center md:text-left'>
						{user?.name}
					</div>
					<div className='text-sm text-gray-500 dark:text-gray-400 mb-4 text-center md:text-left'>
						{user?.role === RoleEnum.USER && t('profile.role.user', 'Користувач')}
						{user?.role === RoleEnum.ESTABLISHMENT_ADMIN &&
							t('profile.role.establishment_admin', 'Адміністратор закладу')}
						{user?.role === RoleEnum.CRITIC && t('profile.role.critic', 'Критик')}
						{user?.role === RoleEnum.SUPERADMIN &&
							t('profile.role.superadmin', 'Супер адміністратор')}
					</div>
				</div>
				<nav className='flex md:flex-col flex-row gap-2 md:gap-0'>
					{profileMenu
						.filter((item) => !role || item.roles.includes(role))
						.map((item) => (
							<NavLink
								key={item.path}
								to={item.path}
								className={({ isActive }) =>
									'block px-4 py-2 rounded transition ' +
									(isActive || location.pathname === item.path
										? 'bg-purple-100 text-purple-700 font-bold dark:bg-purple-900 dark:text-white'
										: 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700')
								}
								end
							>
								{t(item.label)}
							</NavLink>
						))}
				</nav>
			</aside>
			<main className='flex-1 p-4 md:p-8'>
				<RequireProfileRole>
					<Outlet />
				</RequireProfileRole>
			</main>
		</div>
	);
}
