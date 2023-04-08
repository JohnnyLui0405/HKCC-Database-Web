import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import "./style.css";
import ECharts from "vue-echarts";
import "echarts/lib/chart/line";

const app = createApp(App);

// app.use(naive);
app.component("chart", ECharts);
app.use(router);
app.mount("#app");
