<template>
    <Bar :data="props.chartData" :options="options" />
</template>
  
<script setup>
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    Colors
} from 'chart.js'
import { ref } from 'vue'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors)

const props = defineProps({
    chartData: {
        type: Object,
        required: true
    }
})

const options = {
    responsive: true,
    maintainAspectRatio: false,
}
</script>
  