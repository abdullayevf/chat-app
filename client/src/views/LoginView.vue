<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import {useRouter} from 'vue-router'
import { useAuthStore } from '../stores/auth'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../components/ui/form'
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { toast } from 'vue-sonner'

const formSchema = toTypedSchema(z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(16, "Password must be less than 16 characters long")
}))

const router = useRouter()
const authStore = useAuthStore()

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  login(values.email, values.password)
})

async function login(email: string, password: string) {
  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }

    toast.success('Login successful', {
      description: "You will now be redirected to your chats."
    })

    authStore.setToken(data.token)
    router.push("/chat")

    console.log('Login successful:', data)

  } catch (error) {
    console.error('Login error:', error)
    toast.error('Login failed', {
      description: error instanceof Error ? error.message : 'An unexpected error occurred'
    })
  }
}

</script>

<template>
  <div>
    <h1 class="text-center font-bold mb-4">Login View</h1>
    <form @submit.prevent="onSubmit" class="bg-white space-y-4 text-slate-400 rounded-lg p-4 max-w-96 mx-auto">

      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="example@mail.com" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input type="password" placeholder="safepassword" v-bind="componentField" />
          </FormControl>
        </FormItem>
      </FormField>
      <Button type="submit">
        Submit
      </Button>
    </form>
  </div>
</template>
