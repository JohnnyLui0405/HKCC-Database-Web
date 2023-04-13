<template>
    <Pie :data="props.chartData" :options="options" />
</template>
  
<script setup>
import { Bar, Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, Colors } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, Colors)

const props = defineProps({
    chartData: {
        type: Object,
        required: true
    }
})

const options = {
    responsive: true,
    maintainAspectRatio: true,
}
</script>