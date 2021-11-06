import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import Company from "../views/Company.vue";
import Logs from "../views/Logs.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: true,
    children: [
      {
        path: "symbol/:symbol",
        name: "Company",
        component: Company,
        props: true,
      },
    ],
  },
  {
    path: "/logs",
    name: "Logs",
    component: Logs,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// Save each route to localstorage.
router.beforeEach((to, from, next) => {
  // Get route history from localstorage.
  const history = localStorage.getItem("routingHistory")
    ? JSON.parse(localStorage.getItem("routingHistory"))
    : [];
  const routerHistory = {
    from: from.fullPath, // Fullpath at from.
    to: to.fullPath, // Fullpath at to.
    date: new Date(),
    authorized: to.name === "Logs" ? store.getters.getIsAdmin : true,
  };
  history.push(routerHistory);
  localStorage.setItem("routingHistory", JSON.stringify([...history]));
  next();
});

export default router;
