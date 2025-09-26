<template>
  <header class="campaign-topbar">
    <div class="top-links">
      <h3>{{ $t("CAMPAIGNS.YOUR_CAMPAIGNS") }}</h3>
    </div>

    <div class="fab-wrapper" ref="wrapper">
      <button
          type="button"
          class="fab fab-square"
      >
        <router-link class="link-ghost" :to="`/campaigns/new`">+</router-link>
      </button>

      <div class="fab-menu" v-show="open" role="menu" :id="menuId">
        <router-link
            class="fab-action"
            role="menuitem"
            :to="`/campaigns/${campaignId}/characters/new`"
            @click="close()"
        >
          {{ $t("CAMPAIGNS.NEW_SHEET") }}
        </router-link>
        <router-link
            class="fab-action"
            role="menuitem"
            :to="`/campaigns/${campaignId}/items/new`"
            @click="close()"
        >
          {{ $t("ITEMS.NEW_ITEM") }}
        </router-link>
      </div>
    </div>
  </header>
  <ul class="campaign-list">
    <li v-for="c in campaigns" :key="c.id" class="campaign-item">
      <div class="campaign-header">
        <h3 class="campaign-title">{{ c.title }}</h3>
        <router-link class="btn btn-accent" :to="`/campaigns/${c.id}`">
          {{ $t('COMMON.OPEN') }}
        </router-link>
      </div>
      <p class="campaign-meta">ID: {{ c.TSID }}</p>
    </li>

    <li v-if="!loading && !campaigns.length" class="campaign-empty">
      {{ $t('CAMPAIGN.LIST.EMPTY') }}
    </li>
  </ul>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import http from '@/api/http';
import {useAuthStore} from '@/stores/auth';

const auth = useAuthStore();
const campaigns = ref([]);
const loading = ref(false);
const errMsg = ref(null);

async function fetchCampaigns() {
  if (!auth.userId) return;
  loading.value = true;
  errMsg.value = null;

  try {
    const {data} = await http.get('/Campaign/CampaignsByUserId', {
      params: {userId: auth.userId}, // => ?userId=<guid>
    });

    campaigns.value = (Array.isArray(data) ? data : []).map(c => ({
      id: c.id,
      title: c.name,
      TSID: c.campaignTaleSpireId,
      raw: c,
    }));
  } catch (err) {
    errMsg.value = err?.response?.data?.error || 'Load failed';
    console.warn('campaigns load error:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchCampaigns);
</script>
