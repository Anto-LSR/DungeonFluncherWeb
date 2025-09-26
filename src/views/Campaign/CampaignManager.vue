<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue';
import {useRoute} from 'vue-router';
import http from '@/api/http';

const route = useRoute();

const campaignId = ref(String(route.params.id || ''));

const loadingCampaign = ref(false);
const campaignErr = ref(null);
const campaignTitle = ref('');     // name
const campaignGuid = ref('');      // id
const currentTaleId = ref('');     // TaleSpireCampaignid

async function loadCampaign() {
  if (!campaignId.value) return;
  loadingCampaign.value = true;
  campaignErr.value = null;

  try {
    const {data} = await http.get('/Campaign/CPR/CampaignByCampaignId', {
      params: {campaignId: campaignId.value},
    });
    // DTO: (id, TaleSpireCampaignid, name, players, users, systemEnum)
    campaignTitle.value = data?.name || '';
    campaignGuid.value = data?.id || '';
    currentTaleId.value = data?.taleSpireCampaignid || data?.taleSpireCampaignId || '';
  } catch (err) {
    campaignErr.value = err?.response?.data?.error || 'Load failed';
  } finally {
    loadingCampaign.value = false;
  }
}

const open = ref(false);
const wrapper = ref(null);
const menuId = 'fab-menu';

const toggle = () => (open.value = !open.value);
const close = () => (open.value = false);

function onClickOutside(e) {
  if (!wrapper.value) return;
  if (!wrapper.value.contains(e.target)) close();
}

onMounted(() => {
  document.addEventListener('click', onClickOutside);
  loadCampaign(); // Charge les données réelles de la campagne
});
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside));

// Mock personnages conservé
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
  ];
});

/* ——— Liaison TaleSpire ——— */
const linkOpen = ref(false);
const taleId = ref('');
const saving = ref(false);
const errMsg = ref(null);
const okMsg = ref(null);

function cancelLink() {
  linkOpen.value = false;
  taleId.value = '';
  errMsg.value = null;
  okMsg.value = null;
}

async function linkTaleSpire() {
  if (!taleId.value || !campaignGuid.value) return;
  saving.value = true;
  errMsg.value = null;
  okMsg.value = null;
  try {
    await http.patch('/Campaign/LinkTaleSpire', {
      campaignId: campaignGuid.value,
      taleSpireCampaignId: taleId.value,
    });
    okMsg.value = 'TaleSpire lié avec succès';
    currentTaleId.value = taleId.value;
    cancelLink();
  } catch (err) {
    const data = err?.response?.data;
    errMsg.value = (typeof data === 'string' ? data : data?.error) || 'Échec de la liaison';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <section class="campaign-view">
    <header class="campaign-topbar">
      <div class="top-links">
        <router-link class="link-ghost" :to="`/campaigns/${campaignId}/characters`">
          {{ $t('COMMON.SHEETS') }}
        </router-link>
        <router-link class="link-ghost" :to="`/campaigns/${campaignId}/items`">
          {{ $t('COMMON.ITEMS') }}
        </router-link>
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
            {{ $t('CAMPAIGNS.NEW_SHEET') }}
          </router-link>
          <router-link
              class="fab-action"
              role="menuitem"
              :to="`/campaigns/${campaignId}/items/new`"
              @click="close()"
          >
            {{ $t('ITEMS.NEW_ITEM') }}
          </router-link>
        </div>
      </div>
    </header>

    <h1 class="campaign-title">
      {{ loadingCampaign ? '...' : (campaignTitle || $t('CAMPAIGN.UNTITLED')) }}
    </h1>
    <small v-if="currentTaleId" class="tale-bound">
      Id Talespire: {{ currentTaleId }}
    </small>

    <!-- Barre de recherche + Action TaleSpire à droite -->
    <div class="search-bar row">
      <input
          v-model="query"
          type="search"
          class="input-search"
          :placeholder="$t('SHEETS.SEARCH_PLACEHOLDER')"
          :aria-label="$t('SHEETS.SEARCH_PLACEHOLDER')"
      />

      <div class="link-pane" v-if="!linkOpen">
        <button
            type="button"
            class="btn btn-accent small btn-inline"
            @click="linkOpen = true"
            :aria-describedby="'tip-link-tale'"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
            <path fill="currentColor"
                  d="M3.9 12a5 5 0 0 1 5-5h3v2h-3a3 3 0 1 0 0 6h3v2h-3a5 5 0 0 1-5-5zm6-1h4v2h-4v-2zm5.1-4h-3V5h3a5 5 0 1 1 0 10h-3v-2h3a3 3 0 1 0 0-6z"/>
          </svg>
          <span class="btn-text">{{ $t('CAMPAIGN.LINK_TALESPIRE_SHORT') }}</span>
        </button>
      </div>

      <div class="link-pane" v-else>
        <input
            v-model="currentTaleId"
            type="text"
            class="input-tale"
            placeholder="00000000-0000-0000-0000-000000000000"
            :aria-label="$t('CAMPAIGN.TALESPIRE_ID_INPUT')"
        />
        <button
            type="button"
            class="btn-ghost small"
            :aria-label="$t('COMMON.SAVE')"
            @click="linkTaleSpire()"
            :disabled="saving"
        >
          {{ saving ? $t('COMMON.SAVING') : $t('COMMON.SAVE') }}
        </button>
        <button
            type="button"
            class="btn-ghost small"
            :aria-label="$t('COMMON.CANCEL')"
            @click="cancelLink()"
        >
          {{ $t('COMMON.CANCEL') }}
        </button>
      </div>
    </div>

    <p v-if="campaignErr" class="msg error">{{ campaignErr }}</p>
    <p v-if="errMsg" class="msg error">{{ errMsg }}</p>
    <p v-if="okMsg" class="msg success">{{ okMsg }}</p>

    <h2 class="section-title">{{ $t('SHEETS.CHARACTER_SHEETS') }}</h2>
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
            <p class="char-meta">
              {{ $t('CHARACTER.ROLE') }}: {{ c.role }} •
              {{ $t('CHARACTER.LEVEL') }}: {{ c.level }}
            </p>
          </div>
          <router-link :to="`/characters/${c.id}`" class="btn btn-accent">
            {{ $t('COMMON.OPEN') }}
          </router-link>
        </div>
      </li>
      <li v-if="!filteredCharacters.length" class="char-empty">
        {{ $t('SHEETS.NO_RESULTS') }}
      </li>
    </ul>
  </section>
</template>


<style scoped>
/* Layout barre de recherche + contrôle à droite */
.search-bar.row {
  display: flex;
  gap: .6rem;
  align-items: center;
  margin: .75rem 0 1.25rem;
}

.input-search {
  flex: 1 1 auto;
}

.link-pane {
  display: flex;
  gap: .4rem;
  align-items: center;
  margin-left: auto;
}

.input-tale {
  min-width: 340px;
  padding: .45rem .6rem;
  border-radius: 4px;
  border: 1.5px solid #550000;
  background: #2a2725;
  color: #E0DED7;
}

.btn.small, .btn-ghost.small {
  padding: .35rem .6rem;
  font-size: .95rem;
}

/* Styles existants (extraits) */
.fab {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  border: 1.5px solid var(--border-light, #550000);
  background: #332f2d;
  color: #E0DED7;
  font-size: 1.4rem;
  font-weight: 900;
  box-shadow: 0 0 12px rgba(243, 18, 18, .25);
  cursor: pointer;
  border-left: 4px solid var(--color-accent, #f31212);
}

.fab:hover, .fab:focus {
  outline: none;
  background: #3a3736;
}

.msg {
  margin-top: .5rem;
}

.msg.error {
  color: #ff6b6b;
}

.msg.success {
  color: #8bc34a;
}
</style>
