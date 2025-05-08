import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ChatView from '@/views/ChatView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/chat',
        name: 'chat',
        component: ChatView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const isAuthenticated = authStore.isAuthenticated

    const publicRoutes = ['home', 'login']
    
    if (!publicRoutes.includes(to.name as string) && !isAuthenticated) {
        return next({ name: 'login' })
    }

    if (to.name === 'login' && isAuthenticated) {
        return next({ name: 'chat' })
    }

    next()
})

export default router