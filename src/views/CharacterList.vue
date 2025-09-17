<template>
  <ul>
    <li v-for="character in characters" :key="character.id">{{ character.name }}</li>
  </ul>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
const characters = ref([]);
onMounted(async () => {
  const res = await axios.get('/api/characters');
  characters.value = res.data;
});
</script>
