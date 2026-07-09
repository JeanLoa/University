import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { TranslationService } from "./app/shared/application/services/translation.service";

import "./assets/styles/main.css";

async function bootstrap() {
    await TranslationService.initialize();

    createApp(App)
        .use(router)
        .mount("#app");
}

bootstrap();