<template>
  <n-grid cols="1 s:2 m:3 l:4 xl:4 2xl:4" responsive="screen" :x-gap="12" :y-gap="8">
    <n-grid-item>
      <NCard title="User Info" :segmented="{ content: true, footer: true }" size="medium" :bordered="false">
        <n-skeleton v-if="loading" :width="100" size="medium" />
        <div v-else>
          <n-statistic label="User Name" tabular-nums>
            {{ userData.userName }}
          </n-statistic>
          <n-statistic label="Registration Time" tabular-nums>
            <n-number-animation show-separator :from="1" :to="userData.registerTimeDays" :active="true" />
            <template #suffix>
              <span>days ago</span>
            </template>
          </n-statistic>
          <n-statistic label="Access Time" tabular-nums>
            <n-number-animation show-separator :from="1" :to="userData.accessTimeDays" :active="true" />
            <template #suffix>
              <span>days ago</span>
            </template>
          </n-statistic>
        </div>
      </NCard>
    </n-grid-item>


    <n-grid-item>
      <NCard title="User Name" :segmented="{ content: true, footer: true }" size="medium" :bordered="false">
        <n-skeleton v-if="loading" :width="100" size="medium" />
        <n-statistic v-else tabular-nums label="Player">
          {{ userData.userName }}
        </n-statistic>
      </NCard>
    </n-grid-item>
    <n-grid-item>
      <NCard title="Registration Time" :segmented="{ content: true, footer: true }" size="medium" :bordered="false">
        <n-skeleton v-if="loading" :width="100" size="medium" />
        <n-statistic v-else tabular-nums label="Registered">
          <n-number-animation show-separator :from="1" :to="userData.registerTimeDays" :active="true" />
        </n-statistic>
      </NCard>
    </n-grid-item>
    <n-grid-item>
      <NCard title="Access Time" :segmented="{ content: true, footer: true }" size="medium" :bordered="false">
        <n-skeleton v-if="loading" :width="100" size="medium" />
        <n-statistic v-else tabular-nums label="Last Access At">
          <n-number-animation show-separator :from="1" :to="userData.accessTimeDays" :active="true" />
        </n-statistic>
      </NCard>
    </n-grid-item>
    <n-grid-item>
      <NCard title="Battle Point" :segmented="{ content: true, footer: true }" size="medium" :bordered="false">
        <n-skeleton v-if="loading" :width="100" size="medium" />
        <n-statistic v-else tabular-nums label="Points">
          <n-number-animation show-separator :from="1" :to="userData.battlePoint" :active="true" />
        </n-statistic>
      </NCard>
    </n-grid-item>



    <n-grid-item>
      <NCard title="Battle Point" :segmented="{ content: true, footer: true }" size="medium" :bordered="false">
        <n-skeleton v-if="loading" :width="100" size="medium" />
        <n-statistic v-else tabular-nums>
          <n-number-animation show-separator :from="1" :to="userData.battlePoint" :active="true" />
        </n-statistic>
      </NCard>
    </n-grid-item>
    <n-grid-item>
      <NCard title="Rating" :segmented="{ content: true, footer: true }" size="medium" :bordered="false">
        <n-skeleton v-if="loading" :width="100" size="medium" />
        <n-statistic v-else label="Well" tabular-nums>
          <n-number-animation :from="100" :to="0.07" :active="true" :precision="2" />
        </n-statistic>
      </NCard>
    </n-grid-item>
  </n-grid>
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
    loading.value = false;
  }
)

// onMounted(() => {
//   loading.value = false
// });
</script>

<style scoped></style>