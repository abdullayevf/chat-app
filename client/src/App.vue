<script setup lang="ts">
import {Toaster} from "./components/ui/sonner"
</script>

<template>
  <div class="min-h-screen text-white w-full bg-slate-900 p-4">
    <Toaster 
      richColors
      position="bottom-right"
    />
    <nav class="flex gap-2 font-semibold text-sm text-slate-400">
      <RouterLink to="/" class=" hover:text-white">Home</RouterLink>
      <span>/</span>
      <RouterLink to="/login" class=" hover:text-white">Login</RouterLink>
    </nav>
    <RouterView class="mt-4"/>
  </div>


</template>
