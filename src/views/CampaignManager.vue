<template>
  <section class="campaign-view">
    <header class="campaign-topbar">
      <div class="top-links">
        <router-link class="link-ghost" :to="`/campaigns/${campaignId}/characters`">Fiches</router-link>
        <router-link class="link-ghost" :to="`/campaigns/${campaignId}/items`">Objets</router-link>
      </div>

      <div class="fab-wrapper" ref="wrapper">
        <button
            type="button"
            class="fab fab-square"
            @click.stop="toggle()"
            :aria-expanded="open ? 'true' : 'false'"
            aria-haspopup="menu"
            :aria-controls="menuId"
        >
          +
        </button>

        <div class="fab-menu" v-show="open" role="menu" :id="menuId">
          <router-link
              class="fab-action"
              role="menuitem"
              :to="`/campaigns/${campaignId}/characters/new`"
              @click="close()"
          >
            Créer une fiche
          </router-link>
          <router-link
              class="fab-action"
              role="menuitem"
              :to="`/campaigns/${campaignId}/items/new`"
              @click="close()"
          >
            Créer un objet
          </router-link>
        </div>
      </div>
    </header>

    <h1 class="campaign-title">Johnny Silverhand's tales</h1>
    <small>ID : 7894-a4z8x-ze1za5</small>

    <!-- Barre de recherche -->
    <div class="search-bar">
      <input
          v-model="query"
          type="search"
          class="input-search"
          placeholder="Rechercher une fiche (nom, rôle)..."
          aria-label="Rechercher une fiche de personnage"
      />
    </div>

    <h2 class="section-title">Fiches de personnages</h2>
    <ul class="char-list">
      <li v-for="c in filteredCharacters" :key="c.id" class="char-item">
        <div :class="['char-card', typeClass(c.type)]">
          <div class="char-info">
            <div class="char-titleline">
              <h3 class="char-name">{{ c.name }}</h3>
              <span class="type-badge" :class="typeBadgeClass(c.type)">
            {{ (c.type || '???').toUpperCase() }}
          </span>
            </div>
            <p class="char-meta">Role: {{ c.role }} • Niveau: {{ c.level }}</p>
          </div>
          <router-link :to="`/characters/${c.id}`" class="btn btn-accent">Ouvrir</router-link>
        </div>
      </li>
      <li v-if="!filteredCharacters.length" class="char-empty">
        Aucune fiche ne correspond à la recherche.
      </li>
    </ul>
  </section>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue';

const open = ref(false);
const wrapper = ref(null);
const campaignId = 1;
const menuId = 'fab-menu';

const toggle = () => (open.value = !open.value);
const close = () => (open.value = false);

function onClickOutside(e) {
  if (!wrapper.value) return;
  if (!wrapper.value.contains(e.target)) close();
}

onMounted(() => document.addEventListener('click', onClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside));

const characters = ref([]);
const query = ref('');

const filteredCharacters = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return characters.value;
  return characters.value.filter(c =>
      [c.name, c.role].some(v => String(v).toLowerCase().includes(q))
  );
});

function typeClass(t) {
  const k = String(t || '').toLowerCase();
  if (k === 'player') return 'char-player';
  if (k === 'npc') return 'char-npc';
  if (k === 'ennemy' || k === 'enemy') return 'char-enemy';
  return 'char-unknown';
}

function typeBadgeClass(t) {
  const k = String(t || '').toLowerCase();
  if (k === 'player') return 'badge-player';
  if (k === 'npc') return 'badge-npc';
  if (k === 'ennemy' || k === 'enemy') return 'badge-enemy';
  return 'badge-unknown';
}

onMounted(() => {
  characters.value = [
    {id: 101, name: 'Razor', role: 'Solo', level: 6, type: 'player'},
    {id: 103, name: 'Johnny', role: 'Rockerboy', level: 5, type: 'npc'},
    {id: 102, name: 'Kali', role: 'Netrunner', level: 5, type: 'ennemy'},
    {id: 104, name: 'Franck', role: 'Medtech', level: 11},
  ];
});
</script>

