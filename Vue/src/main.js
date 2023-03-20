import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import "./style.css";

const app = createApp(App);

// app.use(naive);
app.use(router);
app.mount("#app");
