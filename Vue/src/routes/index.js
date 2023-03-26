import { createRouter, createWebHistory } from "vue-router";
import SignIn from "../views/SignIn.vue";
import UserProfile from "../views/Page.vue";
import Test from "../components/Test.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "SignIn", component: SignIn },
        {
            path: "/profile",
            name: "Profile",
            component: UserProfile,
            children: [{ path: "test", component: Test }],
        },
    ],
});

router.beforeEach(async (to, from) => {
    if (!localStorage.getItem("token") && to.name !== "SignIn") {
        // redirect the user to the login page
        return { name: "SignIn" };
    }

    if (localStorage.getItem("token") && to.name === "SignIn") {
        // redirect the user to the Profile page
        return { name: "Profile" };
    }
});

export default router;
