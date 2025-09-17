<template>
  <form @submit.prevent="register">
    <input v-model="username" type="text" placeholder="Nom d'utilisateur" />
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mot de passe" />
    <button type="submit">S’inscrire</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
const username = ref('');
const email = ref('');
const password = ref('');
const register = async () => {
  await axios.post('/api/register', { username: username.value, email: email.value, password: password.value });
};
</script>
