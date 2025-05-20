<template>
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto bg-white text-slate-900 rounded-lg shadow p-4">
            <h1 class="text-2xl font-bold mb-6">Profile Information</h1>
            <div class="space-y-4">
                <div>
                    <span class="font-semibold w-24">Email: </span>
                    <span class="text-gray-700">{{ authStore.user?.email }}</span>
                </div>
            </div>
            <div class="mt-8">
                <Button @click="deleteUser" variant="destructive">Delete My Account</Button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth"
import { toast } from 'vue-sonner'
import { onMounted } from 'vue'
import { useAuthService} from '@/services/auth.service'

const authStore = useAuthStore()

onMounted(async () => {
    if (!authStore.user) {
        await authStore.initialize()
    }
})

const authService = useAuthService()

const deleteUser = async (async) => {
    await authService.deleteAccount() 
}

</script>