import {createI18n} from 'vue-i18n';
import fr from '@/locales/fr.json';

const i18n = createI18n({
    legacy: false,
    locale: 'fr',
    fallbackLocale: 'fr',
    messages: {fr},
    globalInjection: true, // permet {{ $t('...') }} sans useI18n()
});

export default i18n;
