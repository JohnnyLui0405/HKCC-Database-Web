<template>
  <div class="container">
    <n-grid x-gap="12" y-gap="0" cols="1 s:2 m:2 l:3 xl:3 2xl:3" responsive="screen">
      <!-- <n-gi>
        <n-card style="height:600px">
          <PieChart v-if="!loading" :chartData="{
            labels: data.labels, datasets: [{ data: data.data }]
          }" />
        </n-card>
      </n-gi> -->

      <n-gi v-if="!loading" v-for="item in dataList">
        <n-card style="height:600px">
          <template #header>
            {{ item.title }}
          </template>
          <BarChart v-if="!loading" :chartData="{
            labels: item.labels, datasets: [{ data: item.data, label: item.label, backgroundColor: item.backgroundColor }]
          }" />
        </n-card>
      </n-gi>

    </n-grid>

  </div>
</template>

<script setup>
import PieChart from "../charts/PieChart.vue";
import BarChart from "../charts/BarChart.vue";
import { NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter, NLayoutSider, NSpace } from "naive-ui";
import { onMounted, ref } from "vue";
import axios from "axios";
axios.defaults.baseURL = "https://dbprojectapi.courtcloud.me";
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
const data = ref(null);
const loading = ref(true);
const backgroundColor = ref([]);
const dataList = ref([]);
const DashBoardApis = [{ "path": "/api/user/getMusicPlaysCount", label: "count", title: "Music Plays Count" }, { "path": "/api/user/getPlayerRank", label: "Player Rating", title: "Player Rating Rank" }];

onMounted(() => {
  for (const API of DashBoardApis) {
    axios.post(API.path).then((res) => {
      console.log(res.data.data);
      res.data.data.label = API.label;
      res.data.data.title = API.title;
      const backgroundColor = ref([]);
      res.data.data.labels.forEach((label, index) => {
        backgroundColor.value.push(`hsl(${Math.random() * 360}, 100%, 50%)`)
      })
      res.data.data.backgroundColor = backgroundColor.value;
      dataList.value.push(res.data.data);
      data.value = res.data.data;
      console.log(data.data);
    });
    loading.value = false;
  }
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