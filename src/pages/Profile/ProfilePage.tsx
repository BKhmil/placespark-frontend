import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PROFILE_TABS } from '../../constants/profile-tabs.constants';
import { RoleEnum } from '../../enums/role.enum';
import { useAppSelector } from '../../hooks/rtk';
import EstablishmentAdminCreatePlaceSection from './EstablishmentAdminCreatePlaceSection';
import MyPlacesTab from './MyPlacesTab';
import ProfileEditForm from './ProfileEditForm';

const ProfilePage = () => {
	const { t } = useTranslation();
	const { user } = useAppSelector((state) => state.user);
	const [tab, setTab] = useState('profile');
	const navigate = useNavigate();

	if (!user) {
		return (
			<div className='min-h-[60vh] flex flex-col items-center justify-center text-center'>
				<h1 className='mb-4 text-3xl font-bold text-gray-900 dark:text-white'>
					{t('profile.auth_required', 'Потрібна авторизація')}
				</h1>
				<p className='mb-6 text-lg text-gray-600 dark:text-gray-300'>
					{t(
						'profile.auth_required_desc',
						'Будь ласка, увійдіть у свій акаунт.',
					)}
				</p>
			</div>
		);
	}

	const isSuperAdmin = user.role === RoleEnum.SUPERADMIN;
	const isEstablishmentAdmin = user.role === RoleEnum.ESTABLISHMENT_ADMIN;
	const isCritic = user.role === RoleEnum.CRITIC;

	let userTabs = PROFILE_TABS.USER;
	if (isEstablishmentAdmin) {
		userTabs = [...PROFILE_TABS.USER, ...PROFILE_TABS.ESTABLISHMENT_ADMIN];
	}
	if (isCritic) {
		userTabs = [...PROFILE_TABS.USER, ...PROFILE_TABS.CRITIC];
	}
	const superAdminTabs = isSuperAdmin ? PROFILE_TABS.SUPERADMIN : [];
	const allTabs = [...userTabs, ...superAdminTabs];

	return (
		<div className='flex flex-col w-full h-full min-w-full min-h-screen p-4 mt-0 bg-white shadow max-w-none sm:p-8 dark:bg-gray-900 rounded-xl'>
			<button
				type='button'
				onClick={() => navigate(-1)}
				className='px-4 py-2 mb-4 text-sm font-medium text-gray-800 transition bg-gray-200 rounded dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
			>
				{t('profile.back', 'Назад')}
			</button>
			<h1 className='mb-6 text-3xl font-bold text-center text-gray-900 dark:text-white'>
				{t('profile.title', 'Особистий кабінет')}
			</h1>
			<div className='flex flex-wrap justify-center gap-2 mb-8'>
				{allTabs.map((tItem) => (
					<button
						type='button'
						key={tItem.key}
						onClick={() => setTab(tItem.key)}
						className={`px-4 py-2 rounded transition font-medium text-sm
							${
								tab === tItem.key
									? 'bg-blue-600 text-white'
									: 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-700'
							}`}
					>
						{t(tItem.label)}
					</button>
				))}
			</div>

			<div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[200px]'>
				{tab === 'profile' && <ProfileEditForm />}
				{tab === 'favorites' && (
					<div>
						{t('profile.tab_favorites_content', 'Улюблені заклади (заглушка)')}
					</div>
				)}
				{tab === 'my_places' && <MyPlacesTab />}
				{tab === 'my_comments' && (
					<div>
						{t('profile.tab_my_comments_content', 'Мої коментарі (заглушка)')}
					</div>
				)}
				{tab === 'my_ratings' && (
					<div>
						{t('profile.tab_my_ratings_content', 'Мої оцінки (заглушка)')}
					</div>
				)}
				{tab === 'stats' && (
					<div>
						{t('profile.tab_stats_content', 'Статистика переглядів (заглушка)')}
					</div>
				)}
				{tab === 'messages' && (
					<div>
						{t('profile.tab_messages_content', 'Повідомлення (заглушка)')}
					</div>
				)}
				{tab === 'create_place' && isEstablishmentAdmin && (
					<EstablishmentAdminCreatePlaceSection />
				)}

				{isSuperAdmin && tab === 'moderation' && (
					<div>
						{t(
							'profile.tab_moderation_content',
							'Модерація закладів (заглушка)',
						)}
					</div>
				)}
				{isSuperAdmin && tab === 'all_places' && (
					<div>
						{t('profile.tab_all_places_content', 'Всі заклади (заглушка)')}
					</div>
				)}
				{isSuperAdmin && tab === 'all_users' && (
					<div>
						{t('profile.tab_all_users_content', 'Всі користувачі (заглушка)')}
					</div>
				)}
				{isSuperAdmin && tab === 'analytics' && (
					<div>
						{t('profile.tab_analytics_content', 'Аналітика (заглушка)')}
					</div>
				)}
				{isSuperAdmin && tab === 'edit_app_info' && (
					<div>
						{t(
							'profile.tab_edit_app_info_content',
							'Редагування інформації про додаток (заглушка)',
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ProfilePage;
