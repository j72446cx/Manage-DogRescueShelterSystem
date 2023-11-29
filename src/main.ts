import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import router from './router';
import { usePermissStore } from './store/permiss';
import 'element-plus/dist/index.css';
import './assets/css/icon.css';
import locale from 'element-plus/lib/locale/lang/en'
import element from 'element-plus'
import messageStore from "./store/messageStore";
import ElementPlus from 'element-plus'

const app = createApp(App);
app.use(createPinia());
app.use(ElementPlus);
app.use(router);
app.use(element, { locale })

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

const permiss = usePermissStore();
app.directive('permiss', {
    mounted(el, binding) {
        if (!permiss.key.includes(String(binding.value))) {
            el['hidden'] = true;
        }
    },
});

const token = localStorage.getItem('ms_token');
if (token){
    messageStore.initWebSocket(token);
}


app.mount('#app');
