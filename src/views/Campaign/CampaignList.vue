<template>
  <ul class="campaign-list">
    <li v-for="c in campaigns" :key="c.id" class="campaign-item">
      <div class="campaign-header">
        <h3 class="campaign-title">{{ c.title }}</h3>
        <router-link
            class="btn btn-accent"
            :to="`/campaigns/${c.id}`"
        >
          {{ $t('COMMON.OPEN') }}
        </router-link>
      </div>
      <p class="campaign-meta">ID: {{ c.id }}</p>
    </li>
  </ul>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import http from "@/api/http";
import {useAuthStore} from "@/stores/auth";

const auth = useAuthStore();
const campaigns = ref([]);

const {data} = await http.get('/Campaign/CampaignsByUserId', {
  params: {userId: auth.userId},
});

console.log(data)


onMounted(() => {
  const campaignOne = {id: 1, title: "A l'aube de la zigue"};
  const campaignTwo = {id: 2, title: "Silverhand's tales"};
  campaigns.value.push(campaignOne);
  campaigns.value.push(campaignTwo);
});
</script>
