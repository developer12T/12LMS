import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import "./index.css";
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'

const pinia = createPinia();

// Toast configuration
const toastOptions = {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
};

ModuleRegistry.registerModules([AllCommunityModule]);

const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(Toast, toastOptions);
app.mount("#app");

