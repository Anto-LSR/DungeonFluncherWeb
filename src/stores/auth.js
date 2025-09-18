// src/stores/auth.js
import { defineStore } from 'pinia';
import http from '@/api/http';
import router from "@/router";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isAuth: false,
        bootChecked: false,
        loading: false,
        error: null,
    }),
    getters: {
        loggedIn: (s) => s.isAuth,
    },
    actions: {
        async checkSession() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await http.get('/User/Me'); // 200 => user | 204 => no content
                if (data) {
                    this.user = data;
                    this.isAuth = true;
                } else {
                    this.user = null;
                    this.isAuth = false;
                }
            } catch (e) {
                this.user = null;
                this.isAuth = false;
                this.error = 'Session invalide';
            } finally {
                this.loading = false;
                this.bootChecked = true;
            }
        },

        async login({ pseudo, password }) {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await http.post('/User/Login', { pseudo, password });
                // Le contrôleur renvoie maintenant un objet (Ok(user)), pas une string JSON
                this.user = data || null;
                this.isAuth = !!data;
                // Optionnel: vérifier /User/Me pour homogénéiser
                // await this.checkSession();
            } catch (e) {
                this.user = null;
                this.isAuth = false;
                this.error = 'Échec de connexion';
                throw e;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            this.loading = true;
            this.error = null;
            try {
                await http.post('/User/Logout');
            } catch (e) {
                // Optionnel: feedback utilisateur
                this.error = 'Erreur de déconnexion';
            } finally {
                this.user = null;
                this.isAuth = false;
                this.loading = false;
                router.push({ path: '/login' });
            }
        },
    },
});
