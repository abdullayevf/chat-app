import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ChatView from '@/views/ChatView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'

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
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView
    },
    {
        path: '/profile',
        name: 'profile',
        component: ProfileView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const isAuthenticated = authStore.isAuthenticated

    const publicRoutes = ['home', 'login', 'register']

    if (!publicRoutes.includes(to.name as string) && !isAuthenticated) {
        return next({ name: 'login' })
    }

    if (to.name === 'login' && isAuthenticated) {
        return next({ name: 'chat' })
    }

    next()
})

export default router