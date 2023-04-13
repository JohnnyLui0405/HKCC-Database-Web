<template>
  <PieChart :chartData="{
    labels: ['test', '回レ！雪月花'],
    datasets: [
      {
        backgroundColor: '#f87979',
        data: [19, 1]
      }
    ]
  }" />
</template>

<script setup>
import PieChart from "../charts/PieChart.vue";
import { NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter, NLayoutSider, NSpace } from "naive-ui";


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