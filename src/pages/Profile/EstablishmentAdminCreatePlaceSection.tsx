import { useTranslation } from 'react-i18next';
import CreatePlaceForm from '../../components/CreatePlaceForm';
import { useAppSelector } from '../../hooks/rtk';

const EstablishmentAdminCreatePlaceSection = () => {
	const { t } = useTranslation();
	const { user } = useAppSelector((state) => state.user);

	let hasPlace = false;

	if (user) {
		hasPlace = user.admin_establishments.length > 0;
	}

	if (hasPlace) {
		return (
			<div className='text-center text-gray-500 dark:text-gray-400'>
				{t(
					'profile.create_place_already_exists',
					'У вас вже є заклад. Ви не можете створити більше одного.',
				)}
			</div>
		);
	}

	return (
		<div>
			<h2 className='mb-4 text-xl font-bold'>
				{t('profile.create_place_title', 'Створити заклад')}
			</h2>
			<CreatePlaceForm />
		</div>
	);
};

export default EstablishmentAdminCreatePlaceSection;
