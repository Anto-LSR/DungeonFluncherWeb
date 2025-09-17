import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/css/main.css';  // Import CSS sans variable

const app = createApp(App);
app.use(router);
app.mount('#app');
