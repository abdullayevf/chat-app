// client/src/services/auth.service.ts
import { api } from './api'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

export const useAuthService = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  const login = async (email: string, password: string) => {
    try {
      const data = await api.auth.login(email, password)
      
      if (!data.token) {
        throw new Error(data.message || 'Login failed')
      }

      authStore.setToken(data.token)
      toast.success('Login successful')
      router.push('/chat')
    } catch (error) {
      toast.error('Login failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      })
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const data = await api.auth.register(email, password)
      
      if (!data.token) {
        throw new Error(data.message || 'Registration failed')
      }

      authStore.setToken(data.token)
      toast.success('Registration successful')
      router.push('/profile')
    } catch (error) {
      toast.error('Registration failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      })
      throw error
    }
  }

  const deleteAccount = async () => {
    try {
      await api.auth.deleteAccount(authStore.token!)
      toast.success('Account deleted successfully')
      authStore.logout()
    } catch (error) {
      toast.error('Failed to delete account')
      throw error
    }
  }

  return {
    login,
    register,
    deleteAccount
  }
}