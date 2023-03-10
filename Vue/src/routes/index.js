import { createRouter, createWebHistory } from "vue-router";
import SignIn from "../views/SignIn.vue";
import userProfile from "../views/Page.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", name: "SignIn", component: SignIn },
    { path: "/profile", name: "Profile", component: userProfile },
  ],
});

router.beforeEach(async (to, from) => {
  if (true && to.name !== "SignIn") {
    // redirect the user to the login page
    return { name: "SignIn" };
  }
});

export default router;
