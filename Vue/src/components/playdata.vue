<template>
  <PieChart v-if="!loading" :chartData="{
    labels: data.labels,
    datasets: [
      {
        backgroundColor: '#f87979',
        data: data.data
      }
    ]
  }" />
</template>

<script setup>
import PieChart from "../charts/PieChart.vue";
import { NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter, NLayoutSider, NSpace } from "naive-ui";
import { onMounted, ref } from "vue";
import axios from "axios";
axios.defaults.baseURL = "https://dbprojectapi.courtcloud.me";
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
const data = ref(null);
const loading = ref(true);
onMounted(async () => {
  const res = await axios({
    method: "post",
    url: "/api/user/getMusicPlayedCount"
  }).catch(err => {
    console.log(err.response.status)
    if (err.response.status == 403) {
      localStorage.removeItem('token')
      router.push('/signin')
    }
  })
  data.value = res.data
  loading.value = false;
})
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