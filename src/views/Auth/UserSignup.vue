<template>
  <form @submit.prevent="register">
    <input v-model="username" type="text" :placeholder="$t('COMMON.USERNAME')"/>
    <input v-model="email" type="email" placeholder="Email"/>
    <input v-model="password" type="password" :placeholder="$t('COMMON.USERNAME')"/>
    <button type="submit">{{$t('COMMON.SIGN_UP')}}</button>
  </form>
</template>

<script setup>
import {ref} from 'vue';
import http from '@/api/http';
import {useRoute, useRouter} from "vue-router";

const username = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const success = ref(null);
const errMsg = ref(null);

const router = useRouter();
const route = useRoute();
const redirect = route.query.redirect || '/Login';


const register = async () => {
  loading.value = true;
  success.value = null;
  errMsg.value = null;

  try {
    const {data, status} = await http.post('/User/Register', {
      pseudo: username.value,
      email: email.value,
      password: password.value,
    });
    // Succès: data contient l'utilisateur créé (selon ton contrôleur)
    success.value = `Inscription réussie (status ${status})`;
    console.log('register success:', data);
    router.push(String(redirect));
  } catch (err) {
    // Axios place la réponse serveur dans err.response si disponible
    if (err?.response) {
      const {status, data} = err.response;
      // data peut être un string ou un objet { error: "..."} selon le contrôleur
      const message = typeof data === 'string' ? data : (data?.error || JSON.stringify(data));
      errMsg.value = `Échec (${status}) — ${message}`;
      console.warn('register error response:', status, data);
    } else if (err?.request) {
      errMsg.value = 'Erreur réseau: aucune réponse du serveur';
      console.warn('register network error:', err.request);
    } else {
      errMsg.value = `Erreur: ${err?.message || 'inconnue'}`;
      console.warn('register error:', err);
    }
  } finally {
    loading.value = false;
  }
};
</script>
