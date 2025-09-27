<script setup>
import {ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import http from '@/api/http';
import {useAuthStore} from '@/stores/auth';

const API = {
  create: '/Campaign/Create',
};

const SYSTEM = {
  CyberpunkRed: 0, // aligné avec l’enum backend numérique
};

const {t} = useI18n();
const router = useRouter();
const auth = useAuthStore();

const form = ref({
  name: '',
  userId: auth.userId || '',
  systemEnum: 'CyberpunkRed', // valeur UI string
  talespireCampaignId: '',
});

const loading = ref(false);
const errMsg = ref(null);
const okMsg = ref(null);

const canSubmit = computed(
    () => !!form.value.name && !!form.value.userId && !!form.value.systemEnum
);

async function submit() {
  errMsg.value = null;
  okMsg.value = null;

  if (!canSubmit.value) {
    errMsg.value = t('CAMPAIGN.CREATE.VALIDATION_REQUIRED');
    return;
  }

  loading.value = true;
  try {
    const payload = {
      name: form.value.name,
      userId: auth.userId,
      systemEnum: SYSTEM[form.value.systemEnum] ?? SYSTEM.CyberpunkRed,
      talespireCampaignId:
          form.value.talespireCampaignId ||
          '00000000-0000-0000-0000-000000000000',
    };

    const {data} = await http.post(API.create, payload);
    // Le backend renvoie l'ID (Guid) de la campagne créée
    const createdId = data; // ton contrôleur retourne Guid (pas un objet)
    if (createdId) {
      router.push(`/campaigns/${createdId}`);
      return;
    }

    okMsg.value = t('CAMPAIGN.CREATE.SUCCESS'); // fallback si pas d’ID
  } catch (err) {
    if (err?.response) {
      const data = err.response.data;
      const serverMsg =
          typeof data === 'string' ? data : data?.error || null;
      errMsg.value = serverMsg || t('CAMPAIGN.CREATE.ERROR_GENERIC');
    } else if (err?.request) {
      errMsg.value = t('COMMON.NETWORK_ERROR');
    } else {
      errMsg.value = err?.message || t('CAMPAIGN.CREATE.ERROR_GENERIC');
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="campaign-create content">
    <header class="cc-header">
      <h1>{{ $t('CAMPAIGN.CREATE.TITLE') }}</h1>
    </header>

    <form class="cc-form" @submit.prevent="submit">
      <div class="field">
        <label for="name">{{ $t('CAMPAIGN.CREATE.NAME_LABEL') }}</label>
        <input
            id="name"
            v-model="form.name"
            type="text"
            :placeholder="$t('CAMPAIGN.CREATE.NAME_PH')"
            required
        />
      </div>

      <div class="field">
        <label for="system">{{ $t('CAMPAIGN.CREATE.SYSTEM_LABEL') }}</label>
        <select v-model="form.systemEnum" class="select-cpr" required>
          <option value="CyberpunkRed">
            {{ $t('SYSTEM.CYBERPUNK_RED') }}
          </option>
        </select>
      </div>

      <div class="field">
        <label for="talespireCampaignId">
          {{ $t('CAMPAIGN.CREATE.TALESPIRE_ID') }}
        </label>
        <input
            id="talespireCampaignId"
            v-model="form.talespireCampaignId"
            type="text"
            placeholder="00000000-0000-0000-0000-000000000000"
        />
      </div>

      <div class="actions">
        <button type="submit" :disabled="loading || !canSubmit">
          {{ loading ? $t('COMMON.SAVING') : $t('CAMPAIGN.CREATE.SUBMIT') }}
        </button>
        <router-link class="btn-ghost" to="/campaigns">
          {{ $t('COMMON.CANCEL') }}
        </router-link>
      </div>

      <p v-if="errMsg" class="msg error">{{ errMsg }}</p>
      <p v-if="okMsg" class="msg success">{{ okMsg }}</p>
    </form>
  </section>
</template>

<style scoped>
.campaign-create {
  display: grid;
  gap: 1rem;
}

.cc-header h1 {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.cc-form {
  display: grid;
  gap: .75rem;
  max-width: 520px;
}

.field {
  display: grid;
  gap: .35rem;
}

.field.readonly input {
  background: #3a3736;
  color: #cfcac2;
}

.actions {
  display: flex;
  gap: .6rem;
  align-items: center;
}

button[disabled] {
  opacity: .7;
  cursor: not-allowed;
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
