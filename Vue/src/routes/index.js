import { createRouter, createWebHistory } from "vue-router";
import SignIn from "../views/SignIn.vue";
import UserProfile from "../views/Page.vue";
import Logout from "../components/logout.vue";
import Home from "../components/home.vue";
import PlayData from "../components/playData.vue";
import Event from "../components/event.vue";
import Collection from "../components/collection.vue";
import Options from "../components/options.vue";
import WebUser from "../components/webuser.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "SignIn", component: SignIn },
        {
            path: "/profile",
            name: "Profile",
            component: UserProfile,
            children: [
                { path: "home", component: Home },
                { path: "playData", component: PlayData },
                { path: "event", component: Event },
                { path: "collection", component: Collection },
                { path: "options", component: Options },
                { path: "logout", component: Logout },
            ],
        },
        {
            path: "/admin",
            name: "Admin",
            component: UserProfile,
            children: [{ path: "webuser", component: WebUser }],
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
