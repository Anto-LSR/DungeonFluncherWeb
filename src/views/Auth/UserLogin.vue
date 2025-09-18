<template>
  <form @submit.prevent="onLogin" class="login-form">
    <input v-model="username" type="text" :placeholder="$t('COMMON.USERNAME')" />
    <input v-model="password" type="password" :placeholder="$t('COMMON.PASSWORD')" />
    <button type="submit" :disabled="loading">{{ $t("LOGIN.SIGN_IN") }}</button>

    <p v-if="errMsg" class="error">{{ errMsg }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const username = ref('');
const password = ref('');
const loading = ref(false);
const errMsg = ref(null);

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const onLogin = async () => {
  loading.value = true;
  errMsg.value = null;

  try {
    await auth.login({ pseudo: username.value, password: password.value });
    const redirect = route.query.redirect || '/campaigns';
    router.push(String(redirect));
  } catch (err) {
    // Récupère le message serveur si fourni, sinon fallback générique
    if (err?.response) {
      const { status, data } = err.response;
      const serverMsg = typeof data === 'string' ? data : (data?.error || null);
      errMsg.value = serverMsg || `Connexion échouée (code ${status})`;
    } else if (err?.request) {
      errMsg.value = 'Erreur réseau: aucune réponse du serveur';
    } else {
      errMsg.value = err?.message || 'Erreur inconnue';
    }
    // Optionnel: log dev
    // console.warn('login error', err);
  } finally {
    loading.value = false;
  }
};
</script>