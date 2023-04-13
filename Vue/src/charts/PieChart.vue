<template>
    <div class="container">
        <Pie v-if="loaded" :data="chartData" />
    </div>
</template>
  
<script>
import { Bar, Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { defineProps } from 'vue'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
    name: 'BarChart',
    components: { Bar, Pie },
    props: ['chartData'],
    data: () => ({
        loaded: false,
    }),
    async mounted() {
        this.loaded = false

        try {
            // const { userlist } = await fetch('/api/userlist')
            this.loaded = true
        } catch (e) {
            console.error(e)
        }
    }
}
</script>