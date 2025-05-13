<template>
    <section class="text-white min-h-screen flex items-center justify-center px-6">
        <div class="text-center max-w-2xl">
            <h1 class="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Chat Smarter. Connect Instantly.
            </h1>
            <p class="text-lg md:text-xl text-gray-300 mb-8">
                Stay in sync with your team, friends, or customers — wherever they are. Our real-time chat app delivers
                lightning-fast messaging, file sharing, and powerful collaboration tools.
            </p>

            <RouterLink to="/register">
                <Button class="bg-blue-600 hover:bg-blue-700 transition-all">
                    🚀 Get Started Free
                </Button>
            </RouterLink>


            <div class="flex justify-center gap-6 mt-10 text-sm text-gray-400 flex-wrap">
                <div class="flex items-center gap-2">
                    🔒 <span>End-to-End Encryption</span>
                </div>
                <div class="flex items-center gap-2">
                    ⚡ <span>Real-Time Messaging</span>
                </div>
                <div class="flex items-center gap-2">
                    🌍 <span>Accessible Anywhere</span>
                </div>
            </div>
        </div>
    </section>
</template>


<script setup lang="ts">
import { Button } from "../components/ui/button"
import { RouterLink } from "vue-router"
</script>