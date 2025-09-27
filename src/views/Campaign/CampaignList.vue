<template>
  <header class="campaign-topbar">
    <div class="top-links">
      <h3>{{ $t('CAMPAIGNS.YOUR_CAMPAIGNS') }}</h3>
    </div>

    <div class="fab-wrapper">
      <button type="button" class="fab fab-square">
        <router-link class="link-ghost" :to="`/campaigns/new`">+</router-link>
      </button>
    </div>
  </header>

  <ul class="campaign-list">
    <li v-for="c in campaigns" :key="c.id" class="campaign-item">
      <div class="campaign-header">
        <h3 class="campaign-title">{{ c.title }}</h3>
        <div class="campaign-actions">
          <router-link class="btn btn-accent" :to="`/campaigns/${c.id}`">
            {{ $t('COMMON.OPEN') }}
          </router-link>
          <button
              type="button"
              class="btn-ghost small danger"
              @click="openDelete(c)"
              :aria-label="$t('CAMPAIGN.DELETE')"
          >
            {{ $t('COMMON.DELETE') }}
          </button>
        </div>
      </div>
      <p class="campaign-meta">ID: {{ c.TSID }}</p>
    </li>

    <li v-if="!loading && !campaigns.length" class="campaign-empty">
      {{ $t('CAMPAIGN.LIST.EMPTY') }}
    </li>
  </ul>

  <!-- Modale de confirmation de suppression -->
  <div v-if="confirmOpen" class="modal-backdrop" @click.self="closeConfirm">
    <div
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'del-title'"
        :aria-describedby="'del-desc'"
        @keydown.esc="closeConfirm"
        ref="dialogEl"
        tabindex="-1"
    >
      <h3 id="del-title">{{ $t('CAMPAIGN.DELETE_CONFIRM_TITLE') }}</h3>
      <p id="del-desc">
        {{ $t('CAMPAIGN.DELETE_CONFIRM_DESC') }}<br />
        {{ $t('CAMPAIGN.DELETE_CONFIRM_TYPE') }}:
        <strong>{{ currentName }}</strong>
      </p>

      <input
          v-model="confirmInput"
          type="text"
          class="input-confirm"
          :placeholder="currentName"
          :aria-label="$t('CAMPAIGN.DELETE_CONFIRM_INPUT')"
          @keyup.enter="canDelete ? doDelete() : null"
      />

      <div class="modal-actions">
        <button type="button" class="btn-ghost" @click="closeConfirm">
          {{ $t('COMMON.CANCEL') }}
        </button>
        <button
            type="button"
            class="btn danger"
            :disabled="!canDelete || deleting"
            @click="doDelete"
        >
          {{ deleting ? $t('COMMON.DELETING') : $t('COMMON.DELETE') }}
        </button>
      </div>

      <p v-if="delErr" class="msg error">{{ delErr }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import http from '@/api/http';
import { useAuthStore } from '@/stores/auth';

const API = {
  listByUser: '/Campaign/CampaignsByUserId',
  delete: '/Campaign/Delete',
};

const auth = useAuthStore();

/* Liste des campagnes */
const campaigns = ref([]);
const loading = ref(false);
const errMsg = ref(null);

async function fetchCampaigns() {
  if (!auth.userId) return;
  loading.value = true;
  errMsg.value = null;

  try {
    const { data } = await http.get(API.listByUser, {
      params: { userId: auth.userId },
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

/* Suppression avec modale */
const confirmOpen = ref(false);
const dialogEl = ref(null);

const currentId = ref('');
const currentName = ref('');
const confirmInput = ref('');
const deleting = ref(false);
const delErr = ref(null);

function openDelete(c) {
  currentId.value = c.id;
  currentName.value = c.title;
  confirmInput.value = '';
  delErr.value = null;
  confirmOpen.value = true;
  nextTick(() => dialogEl.value?.focus());
}

function closeConfirm() {
  confirmOpen.value = false;
  currentId.value = '';
  currentName.value = '';
  confirmInput.value = '';
  delErr.value = null;
}

const canDelete = computed(
    () => confirmInput.value.trim() === currentName.value
);

async function doDelete() {
  if (!canDelete.value || !currentId.value) return;
  deleting.value = true;
  delErr.value = null;

  try {
    // Variante QueryString (courante) :
    await http.delete(API.delete, { params: { campaignId: currentId.value } });
    // Variante avec body si besoin :
    // await http.delete(API.delete, { data: { campaignId: currentId.value } });

    campaigns.value = campaigns.value.filter(x => x.id !== currentId.value);
    closeConfirm();
  } catch (err) {
    const data = err?.response?.data;
    delErr.value =
        (typeof data === 'string' ? data : data?.error) || 'Delete failed';
  } finally {
    deleting.value = false;
  }
}
</script>

