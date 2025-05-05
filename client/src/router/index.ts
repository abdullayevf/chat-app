import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import("../views/HomeView.vue")
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/LoginView.vue")
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})
