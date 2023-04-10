<template>
  <div class="container">
    <n-card id="playerInfo" title="User Info">
      <n-skeleton v-if="loading" text :repeat="6" />
      <template v-else>
        User Name: {{ userData.userName }}
        <br />
        User Battle Point: <n-number-animation :from="0" :to="userData.battlePoint" />
        <br />
        User Register Time (Days):
        <n-popover trigger="hover">
          <template #trigger>
            {{ userData.registerTime }}
          </template>
          <span><n-number-animation :from="0" :to="userData.registerTimeDays" /> Days</span>
        </n-popover>
        <br />
        User Last Access Time (Days):
        <n-popover trigger="hover">
          <template #trigger>
            {{ userData.accessTime }}
          </template>
          <span><n-number-animation :from="0" :to="userData.accessTimeDays" /> Days</span>
        </n-popover>
        <br />
        Last Game Date (Days):
        <n-popover trigger="hover">
          <template #trigger>
            {{ userData.lastGameDate }}
          </template>
          <span><n-number-animation :from="0" :to="userData.lastGameDateDays" /> Days</span>
        </n-popover>
      </template>
    </n-card>
  </div>
</template>

<script setup>
import { NGrid, NGridItem, NCard, NSkeleton, NStatistic, NNumberAnimation, NTime } from "naive-ui";
import { onMounted, ref } from "vue";
import axios from "axios";
axios.defaults.baseURL = 'https://dbprojectapi.courtcloud.me';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
const loading = ref(true);
let userData = null;
axios({
  method: "post",
  url: "/api/user/getUserInfo"
}).catch(err => {
  console.log(err.response.status)
  if (err.response.status == 403) {
    localStorage.removeItem('token')
    router.push('/signin')
  }
}).then(
  res => {
    console.log(res.data)
    userData = res.data.data[0];
    userData.registerTimeDays = Math.ceil(Math.abs(new Date() - new Date(userData.registerTime)) / (1000 * 60 * 60 * 24));
    userData.accessTimeDays = Math.ceil(Math.abs(new Date() - new Date(userData.accessTime)) / (1000 * 60 * 60 * 24));
    userData.lastGameDateDays = Math.ceil(Math.abs(new Date() - new Date(userData.lastGameDate)) / (1000 * 60 * 60 * 24));
    loading.value = false;
  }
)

// onMounted(() => {
//   loading.value = false
// });
</script>

<style scoped>
#playerInfo {
  max-width: 500px;
  min-width: 100px;
}
</style>