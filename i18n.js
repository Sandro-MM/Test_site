import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as SecureStore from "expo-secure-store";


const resources = {
    en: {
        translation: require('./src/assets/i18n/en.json'),
    },
    ka: {
        translation: require('./src/assets/i18n/ge.json'),
    },
    ru: {
        translation: require('./src/assets/i18n/ru.json'),
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'ka',
        interpolation: {
            escapeValue: false,
        },
    });

const loadLanguageFromStorage = async () => {
    try {
        const storedLanguage = await SecureStore.getItemAsync('userLanguage');
        if (storedLanguage) {
            await i18n.changeLanguage(storedLanguage);
        }
    } catch (error) {
        console.error('Error loading language from storage:', error);
    }
};

loadLanguageFromStorage();

export default i18n;
