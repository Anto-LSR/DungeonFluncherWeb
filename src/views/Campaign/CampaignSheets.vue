<script setup>
import {ref, computed, onMounted} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute();
const campaignId = ref(String(route.params.id || ''));

/* Fiches (mock provisoire jusqu’à l’API) */
const sheets = ref([]);
const query = ref('');

const filteredSheets = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return sheets.value;
  return sheets.value.filter(s =>
      [s.name, s.role].some(v => String(v).toLowerCase().includes(q))
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

onMounted(async () => {
  // TODO: remplacer par l’appel API quand l’endpoint fiches sera prêt
  sheets.value = [
    {id: 101, name: 'Razor', role: 'Solo', level: 6, type: 'player'},
    {id: 103, name: 'Johnny', role: 'Rockerboy', level: 5, type: 'npc'},
    {id: 102, name: 'Kali', role: 'Netrunner', level: 5, type: 'ennemy'},
    {id: 104, name: 'Franck', role: 'Medtech', level: 11},
  ];
});
</script>

<template>
  <section class="campaign-sheets">
    <header class="sheets-topbar">
      <div class="crumbs">
        <router-link class="link-ghost" :to="`/campaigns/${campaignId}`">
          {{ $t('COMMON.OVERVIEW') }}
        </router-link>
        <router-link class="link-ghost active" :to="`/campaigns/${campaignId}/characters`">
          {{ $t('COMMON.SHEETS') }}
        </router-link>
      </div>

      <router-link class="btn btn-accent" :to="`/campaigns/${campaignId}/characters/new`">
        {{ $t('CAMPAIGNS.NEW_SHEET') }}
      </router-link>
    </header>

    <div class="search-bar row">
      <input
          v-model="query"
          type="search"
          class="input-search"
          :placeholder="$t('SHEETS.SEARCH_PLACEHOLDER')"
          :aria-label="$t('SHEETS.SEARCH_PLACEHOLDER')"
      />
    </div>

    <h2 class="section-title">{{ $t('SHEETS.CHARACTER_SHEETS') }}</h2>
    <ul class="char-list">
      <li v-for="s in filteredSheets" :key="s.id" class="char-item">
        <div :class="['char-card', typeClass(s.type)]">
          <div class="char-info">
            <div class="char-titleline">
              <h3 class="char-name">{{ s.name }}</h3>
              <span class="type-badge" :class="typeBadgeClass(s.type)">
                {{ (s.type || '???').toUpperCase() }}
              </span>
            </div>
            <p class="char-meta">
              {{ $t('CHARACTER.ROLE') }}: {{ s.role }} •
              {{ $t('CHARACTER.LEVEL') }}: {{ s.level }}
            </p>
          </div>
          <router-link :to="`/characters/${s.id}`" class="btn btn-accent">
            {{ $t('COMMON.OPEN') }}
          </router-link>
        </div>
      </li>
      <li v-if="!filteredSheets.length" class="char-empty">
        {{ $t('SHEETS.NO_RESULTS') }}
      </li>
    </ul>
  </section>
</template>

<style scoped>
.sheets-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .75rem;
}

.crumbs {
  display: flex;
  gap: .6rem;
  align-items: center;
}



.char-list {
  display: grid;
  gap: .6rem;
}

.char-item {
  list-style: none;
}

.char-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .6rem .75rem;
  border: 1.5px solid #550000;
  border-left: 4px solid #f31212;
  background: #332f2d;
  border-radius: 6px;
}

.char-info {
  display: grid;
  gap: .25rem;
}

.char-titleline {
  display: flex;
  align-items: center;
  gap: .5rem;
}

.char-name {
  margin: 0;
  letter-spacing: .02em;
}

.type-badge {
  font-size: .75rem;
  text-transform: uppercase;
  opacity: .9;
}

.char-meta {
  color: #b7b3ac;
}

.char-player .type-badge {
  color: #a2f5a2;
}

.char-npc .type-badge {
  color: #a2c5f5;
}

.char-enemy .type-badge {
  color: #ff8a80;
}

.char-unknown .type-badge {
  color: #ddd;
}
</style>
