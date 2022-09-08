import router from "@/router/router";
import "vant/lib/index.css";
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).use(router).mount("#app");
