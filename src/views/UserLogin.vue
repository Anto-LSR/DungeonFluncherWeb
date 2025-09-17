<template>
  <form @submit.prevent="login">
    <input v-model="username" type="text" placeholder="Nom d'utilisateur" />
    <input v-model="password" type="password" placeholder="Mot de passe" />
    <button type="submit">Se connecter</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
const username = ref('');
const password = ref('');
const login = async () => {
  await axios.post('/api/login', { username: username.value, password: password.value });
};
</script>
