<template>
  <n-spin :show="loading">
    <div class="container">
      <n-grid v-if="!loading && data.length != 0" x-gap="0" y-gap="20" cols="1 s:3 m:3 l:3 xl:3 2xl:3"
        responsive="screen">
        <template v-for="(item, index) in data">
          <n-gi v-for="(card, index2) in item.children">
            <n-h4 v-if="index2 == 1" style="text-align: center;">Deck: {{ index + 1 }}</n-h4>
            <n-card height="600 px">
              Card Name: {{ card.cardName }}<br>
              Attribute: {{ card.attribute }}<br>
              School: {{ card.school }}<br>
              Section: {{ card.section }}<br>
              Rarity: {{ card.rarity }}
            </n-card>
          </n-gi>

        </template>
      </n-grid>
      <n-empty v-else size="huge" description="No Game Deck Found">
        <template #extra>
        </template>
      </n-empty>
    </div>
  </n-spin>
</template>

<script setup>
import { parseStringStyle } from "@vue/shared";
import axios from "axios";
import { NGrid, NGridItem, NCard, NSkeleton, NStatistic, NNumberAnimation, NTime, breakpoints } from "naive-ui";
import { onMounted, ref } from "vue";
axios.defaults.baseURL = 'https://dbprojectapi.courtcloud.me';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
const loading = ref(true);
let userData = null;
let data = null;
const isMobile = () => {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true
  } else {
    return false
  }
}
console.log(isMobile())
axios({
  method: "post",
  url: "/api/user/getUserGameDeck"
}).catch(err => {
  console.log(err.response.status)
  if (err.response.status == 403) {
    localStorage.removeItem('token')
    router.push('/signin')
  }
}).then(
  res => {
    console.log(res.data.data)
    data = res.data.data.reduce((r, { deckID: deckID, ...object }) => {
      var temp = r.find((o) => o.deckID === deckID);
      if (!temp) r.push((temp = { deckID, children: [] }));
      temp.children.push(object);
      return r;
    }, []);
    console.log(data)
    loading.value = false;
  }
)
</script>

<style scoped>
.n-layout-header,
.n-layout-footer {
  background: rgba(128, 128, 128, 0.2);
  padding: 24px;
}

.n-layout-sider {
  background: rgba(128, 128, 128, 0.3);
}

.n-layout-content {
  background: rgba(128, 128, 128, 0.4);
}
</style>