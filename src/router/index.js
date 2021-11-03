import Vue from "vue";
import VueRouter from "vue-router";
import Company from "../views/Company.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/symbol/:symbol",
    name: "Company",
    component: Company,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
