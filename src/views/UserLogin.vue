<template>
  <form @submit.prevent="onLogin">
    <input v-model="username" type="text" placeholder="Nom d'utilisateur"/>
    <input v-model="password" type="password" placeholder="Mot de passe"/>
    <button type="submit">Se connecter</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const username = ref('');
const password = ref('');
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const onLogin = async () => {
  await auth.login({ pseudo: username.value, password: password.value });
  const redirect = route.query.redirect || '/campaigns';
  router.push(String(redirect));
};
</script>
