<template>
  <div>
    <nav class="menu">
      <router-link v-if="!auth.loggedIn && auth.bootChecked" to="/login" class="menu-item" active-class="active">LOGIN</router-link>
      <router-link v-if="!auth.loggedIn && auth.bootChecked" to="/signup" class="menu-item" active-class="active">SIGN UP</router-link>

      <router-link v-if="auth.loggedIn && auth.bootChecked" to="/campaigns" class="menu-item" active-class="active">CAMPAIGNS</router-link>
      <span class="menu-item" v-if="auth.loggedIn && auth.bootChecked" :disabled="auth.loading" @click="auth.logout()">Logout</span>
    </nav>

    <main class="content">
      <div v-if="!auth.bootChecked" class="app-splash">Chargement…</div>
      <router-view v-else />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

onMounted(() => {
  // hydrate l’état global au premier rendu
  if (!auth.bootChecked) auth.checkSession();
});
</script>


<!--<style scoped>-->
<!--#app {-->
<!--  background-color: #1A1A1A;-->
<!--  color: #E0DED7;-->
<!--  min-height: 100vh;-->
<!--  font-family: 'Roboto Mono', monospace, 'Arial Narrow', Arial, sans-serif;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--  padding: 1.5rem;-->
<!--}-->

<!--/* Menu Styling */-->
<!--.menu {-->
<!--  display: flex;-->
<!--  gap: 2.5rem;-->
<!--  padding: 1rem 0;-->
<!--  width: 100%;-->
<!--  max-width: 900px;-->
<!--  border-bottom: 1px solid #550000;-->
<!--  justify-content: center;-->
<!--  user-select: none;-->
<!--}-->

<!--/* Menu Items */-->
<!--.menu-item {-->
<!--  text-transform: uppercase;-->
<!--  font-weight: 700;-->
<!--  font-size: 1rem;-->
<!--  color: #e0ded7;-->
<!--  letter-spacing: 0.15em;-->
<!--  text-decoration: none;-->
<!--  padding-bottom: 0.25rem;-->
<!--  border-bottom: 3px solid transparent;-->
<!--  transition: border-color 0.3s ease, color 0.3s ease;-->
<!--}-->

<!--/* Active Link */-->
<!--.active {-->
<!--  color: #f31212;-->
<!--  border-bottom-color: #f31212;-->
<!--}-->

<!--/* Hover and Focus */-->
<!--.menu-item:hover,-->
<!--.menu-item:focus {-->
<!--  color: #f31212;-->
<!--  border-bottom-color: #f31212;-->
<!--  outline: none;-->
<!--}-->

<!--/* Content Area */-->
<!--.content {-->
<!--  margin-top: 2rem;-->
<!--  width: 100%;-->
<!--  max-width: 900px;-->
<!--  background-color: #2C2A29;-->
<!--  padding: 2rem;-->
<!--  border-radius: 4px;-->
<!--  box-shadow: 0 0 10px #66000044;-->
<!--  min-height: 520px;-->
<!--  color: #E0DED7;-->
<!--  user-select: text;-->
<!--}-->

<!--/* Scrollbar style */-->
<!--.content::-webkit-scrollbar {-->
<!--  width: 8px;-->
<!--}-->
<!--.content::-webkit-scrollbar-thumb {-->
<!--  background-color: #7a0000;-->
<!--  border-radius: 8px;-->
<!--}-->
<!--.content::-webkit-scrollbar-track {-->
<!--  background-color: #2C2A29;-->
<!--}-->
<!--</style>-->
