<template>
    <div>
        <h1>
            This is your profile my buddy
        </h1>
        <Button @click="deleteUser">Delete My Account</Button>
    </div>
</template>
<script setup>
import { Button } from "@/components/ui/button"
import {useAuthStore} from "@/stores/auth"

const authStore = useAuthStore()

const deleteUser =  async () => {
    console.log(authStore.token);
    
    const response = await fetch("http://localhost:3000/api/auth/delete", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authStore.token}`
        }
    })

    if (!response.ok) {
        console.log(response)
    }

    if (response.ok) {
        authStore.logout()
        console.log("User deleted successfully")
    }
}
</script>