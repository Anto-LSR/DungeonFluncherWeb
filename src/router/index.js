import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '../views/UserLogin.vue';
import UserSignup from '../views/UserSignup.vue';
import CampaignList from '../views/CampaignList.vue';
import CampaignManager from '../views/CampaignManager.vue';
import CharacterList from '../views/CharacterList.vue';
import CharacterManager from '../views/CharacterManager.vue';
import ItemList from "@/views/ItemList.vue";

const routes = [
    { path: '/login', component: UserLogin },
    { path: '/signup', component: UserSignup },
    { path: '/campaigns', component: CampaignList },
    { path: '/campaigns/:id', component: CampaignManager },
    { path: '/campaigns/:id/items', component: ItemList },
    { path: '/characters', component: CharacterList },
    { path: '/characters/:id', component: CharacterManager },
];
export default createRouter({ history: createWebHistory(), routes });
