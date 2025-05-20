<script setup lang="ts">
import { Toaster } from "./components/ui/sonner"
import { useAuthStore } from "./stores/auth"
import { LogOut } from 'lucide-vue-next'

const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen text-white w-full bg-slate-900">
    <Toaster richColors position="bottom-right" />
    <div class="container mx-auto p-4">
      <header class="flex text-slate-400 items-center justify-between">
        <nav class="flex gap-2 font-semibold text-sm">
          <template v-if="!authStore.isAuthenticated">
            <RouterLink to="/" class="hover:text-white">Home</RouterLink>
            <span>/</span>
            <RouterLink to="/login" class="hover:text-white">Login</RouterLink>
            <span>/</span>
            <RouterLink to="/register" class="hover:text-white">Register</RouterLink>
          </template>

          <template v-else>
            <RouterLink to="/chat" class="hover:text-white">Chat</RouterLink>
            <span>/</span>
            <RouterLink to="/profile" class="hover:text-white">Profile</RouterLink>
          </template>
        </nav>
        <LogOut v-if="authStore.isAuthenticated" class="cursor-pointer hover:text-white" :size="16"
          @click="authStore.logout" />
      </header>
    </div>
    <div class="container mx-auto px-4">
      <RouterView />
    </div>
  </div>
</template>
