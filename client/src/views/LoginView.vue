<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("test@example.com");
const password = ref("password");
const error = ref("");

const router = useRouter();

const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const { token } = await res.json();

    localStorage.setItem("auth_token", token);
    router.push("/chat");
  } catch (err) {
    error.value = "Login failed. Please check your credentials.";
  }
};
</script>

<template>
    <h1>Login View</h1>
</template>
