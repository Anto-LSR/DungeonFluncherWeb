<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {useRoute} from 'vue-router';
import http from '@/api/http';

const route = useRoute();
const campaignId = ref(String(route.params.id || ''));

const loadingCampaign = ref(false);
const campaignErr = ref(null);
const campaignTitle = ref('');
const campaignGuid = ref('');
const currentTaleId = ref('');

const players = ref([]);
const playersMocked = ref(false);

async function loadCampaign() {
  if (!campaignId.value) return;
  loadingCampaign.value = true;
  campaignErr.value = null;

  try {
    const {data} = await http.get('/Campaign/CPR/CampaignByCampaignId', {
      params: {campaignId: campaignId.value},
    });
    campaignTitle.value = data?.name || '';
    campaignGuid.value = data?.id || '';
    currentTaleId.value = data?.taleSpireCampaignid || data?.taleSpireCampaignId || '';

    const webUsers = Array.isArray(data?.users) ? data.users : [];
    const cprPlayers = Array.isArray(data?.players) ? data.players : [];

    players.value = webUsers.map(u => ({id: u.id, name: u.pseudo}))
        .concat(
            cprPlayers
                .filter(p => !webUsers.some(u => String(u.id) === String(p.id)))
                .map(p => ({id: p.id, name: p.name || p.pseudo || 'Unknown'}))
        );

    if (!players.value.length) {
      players.value = [{id: 'mock-1', name: 'Matthieu (mock)'}];
      playersMocked.value = true;
    } else {
      playersMocked.value = false;
    }
  } catch (err) {
    campaignErr.value = err?.response?.data?.error || 'Load failed';
  } finally {
    loadingCampaign.value = false;
  }
}

/* FAB + menu */
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
  loadCampaign();
});
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside));

/* Liaison TaleSpire */
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
        <router-link class="link-ghost active" :to="`/campaigns/${campaignId}`">
          {{ $t('COMMON.OVERVIEW') }}
        </router-link>
        <router-link class="link-ghost" :to="`/campaigns/${campaignId}/characters`">
          {{ $t('COMMON.SHEETS') }}
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
        </div>
      </div>
    </header>

    <div class="campaign-headrow">
      <div class="head-left">
        <h1 class="campaign-title">
          {{ loadingCampaign ? '...' : (campaignTitle || $t('CAMPAIGN.UNTITLED')) }}
        </h1>
        <small v-if="currentTaleId" class="tale-bound">
          Id Talespire: {{ currentTaleId }}
        </small>
      </div>

      <div class="head-right">
        <div class="link-pane" v-if="!linkOpen">
          <button
              type="button"
              class="btn btn-accent small btn-inline"
              @click="linkOpen = true"
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
              v-model="taleId"
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
    </div>

    <p v-if="campaignErr" class="msg error">{{ campaignErr }}</p>
    <p v-if="errMsg" class="msg error">{{ errMsg }}</p>
    <p v-if="okMsg" class="msg success">{{ okMsg }}</p>

    <h2 class="section-title">{{ $t('CAMPAIGN.PLAYERS') }}</h2>
    <ul class="players-list">
      <li v-for="p in players" :key="p.id" class="player-item">
        <div class="player-card">
          <div class="player-info">
            <h3 class="player-name">{{ p.name }}</h3>
            <small class="player-id">{{ p.id }}</small>
          </div>
          <span v-if="playersMocked" class="badge-mock">mock</span>
        </div>
      </li>
      <li v-if="!players.length" class="char-empty">
        {{ $t('CAMPAIGN.NO_PLAYERS_YET') }}
      </li>
    </ul>
  </section>
</template>

