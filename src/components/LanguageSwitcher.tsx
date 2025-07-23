import { useTranslation } from 'react-i18next';
import { LocaleStorageEntriesEnum } from "../enums/locale-storage-entries.enum";

const LanguageSwitcher = () => {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		void i18n.changeLanguage(lng);
		localStorage.setItem(LocaleStorageEntriesEnum.LANG, lng);
	};

	return (
		<div className='flex gap-2'>
			<button
				type='button'
				onClick={() => changeLanguage('ua')}
				className={i18n.language === 'ua' ? 'font-bold underline' : ''}
			>
				UA
			</button>
			<button
				type='button'
				onClick={() => changeLanguage('en')}
				className={i18n.language === 'en' ? 'font-bold underline' : ''}
			>
				EN
			</button>
		</div>
	);
};

export default LanguageSwitcher;
