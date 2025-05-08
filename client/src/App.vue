<script setup lang="ts">
import { Toaster } from "./components/ui/sonner"
import { useAuthStore } from "./stores/auth"
import { LogOut } from 'lucide-vue-next'

const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen text-white w-full bg-slate-900 p-4">
    <Toaster richColors position="bottom-right" />
    <header class="flex text-slate-400 items-center justify-between">
      <nav class="flex gap-2 font-semibold text-sm">
        <RouterLink to="/" class="hover:text-white">Home</RouterLink>
        <span v-if="!authStore.isAuthenticated">/</span>
        <RouterLink to="/login" class="hover:text-white" v-if="!authStore.isAuthenticated">Login</RouterLink>
        <span v-if="authStore.isAuthenticated">/</span>
        <RouterLink to="/chat" class="hover:text-white" v-if="authStore.isAuthenticated">Chat</RouterLink>
      </nav>
      <LogOut v-if="authStore.isAuthenticated" class="cursor-pointer hover:text-white" :size="16" @click="authStore.logout" />
    </header>
    <RouterView />
  </div>
</template>
