import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {jwtDecode} from 'jwt-decode'
import { useRouter } from 'vue-router'

export interface UserPayload {
    id: string
    email: string
    password: string
}

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('auth_token'))
    const user = ref<UserPayload | null>(null)
    const router = useRouter()

    const isAuthenticated = computed(() => {
        if (!token.value) return false
        try {
            const payload = jwtDecode(token.value) as any
            return payload.exp * 1000 > Date.now()
        } catch {
            return false
        }
    })

    function setToken(newToken: string) {
        token.value = newToken
        localStorage.setItem('auth_token', newToken)
        try {
            user.value = jwtDecode(newToken)
        } catch {
            console.error('Invalid token format')
        }
    }

    function logout() {
        token.value = null
        user.value = null
        localStorage.removeItem('auth_token')
        router.push('/')
    }

    return { 
        token,
        user,
        logout,
        setToken,
        isAuthenticated 
    }
})