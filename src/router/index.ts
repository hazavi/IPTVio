import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WatchView from '@/views/WatchView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/watch/:countryCode/:channelId', name: 'watch', component: WatchView, props: true },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
