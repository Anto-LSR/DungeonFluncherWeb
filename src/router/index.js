// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import UserLogin from '@/views/Auth/UserLogin.vue';
import UserSignup from '@/views/Auth/UserSignup.vue';
import CampaignList from '@/views/Campaign/CampaignList.vue';
import CampaignManager from '@/views/Campaign/CampaignManager.vue';
import CharacterManager from '@/views/Character/CharacterManager.vue';
import ItemList from '@/views/Item/ItemList.vue';
import CampaignCreate from "@/views/Campaign/CampaignCreate.vue";
import CampaignSheets from "@/views/Campaign/CampaignSheets.vue";

const routes = [
    { path: '/login', component: UserLogin },
    { path: '/signup', component: UserSignup },
    { path: '/campaigns', component: CampaignList, meta: { requiresAuth: true } },
    { path: '/campaigns/:id', component: CampaignManager, meta: { requiresAuth: true } },
    { path: '/campaigns/new', component: CampaignCreate, meta: { requiresAuth: true } },
    { path: '/campaigns/:id/characters', component: CampaignSheets, meta: { requiresAuth: true } },
    { path: '/characters/:id', component: CharacterManager, meta: { requiresAuth: true } },
    { path: '/campaigns/:id/items', component: ItemList, meta: { requiresAuth: true } },
];

const router = createRouter({ history: createWebHistory(), routes });

let bootRan = false;
router.beforeEach(async (to) => {
    const auth = useAuthStore();
    if (!bootRan) {
        bootRan = true;
        await auth.checkSession(); // lit le cookie via /User/Me
    }
    if (to.meta.requiresAuth && !auth.isAuth) {
        return { path: '/login', query: { redirect: to.fullPath } };
    }
    return true;
});

export default router;
