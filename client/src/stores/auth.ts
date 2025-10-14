import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {jwtDecode} from 'jwt-decode'
import { useRouter } from 'vue-router'
import { socketService } from '@/services/socket.service'

export interface UserPayload {
    id: string
    email: string
    password: string
}

interface JWTPayload {
    id: string
    exp: number
}

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('auth_token'))
    const user = ref<UserPayload | null>(null)
    const router = useRouter()

    const isAuthenticated = computed(() => {
        if (!token.value) return false
        try {
            const payload = jwtDecode(token.value) as JWTPayload
            return payload.exp * 1000 > Date.now()
        } catch {
            return false
        }
    })

    async function initialize() {
        if (!token.value) return
        
        try {
            const response = await fetch("http://localhost:3000/api/auth/me", {
                headers: {
                    "Authorization": `Bearer ${token.value}`
                }
            })
            
            if (!response.ok) {
                throw new Error('Failed to fetch user data')
            }

            const userData = await response.json()
            user.value = userData
            
            // Reconnect to Socket.IO if we have a valid token (e.g., page refresh)
            if (token.value && !socketService.isConnected()) {
                socketService.connect(token.value)
            }
        } catch (error) {
            console.error('Error initializing auth store:', error)
            logout()
        }
    }

    function setToken(newToken: string) {
        token.value = newToken
        localStorage.setItem('auth_token', newToken)
        initialize() // Fetch user data after setting token
        
        // Connect to Socket.IO with new token
        socketService.connect(newToken)
    }

    function setUser(userData: UserPayload) {
        user.value = userData
    }

    function logout() {
        token.value = null
        user.value = null
        localStorage.removeItem('auth_token')
        
        // Disconnect from Socket.IO
        socketService.disconnect()
        
        router.push('/')
    }

    return { 
        token,
        user,
        logout,
        setToken,
        setUser,
        initialize,
        isAuthenticated 
    }
})