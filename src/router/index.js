import Vue from "vue";
import VueRouter from "vue-router";
import fs from "fs";
import Company from "../views/Company.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/symbol/:symbol",
    name: "Company",
    component: Company,
    props: true,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  let history = {
    to,
    from,
    date: new Date(),
  };
  var json = JSON.stringify(history);
  fs.writeFile(require("../data/history.json"), json, "utf8", () => {
    console.log("wrote");
  });
  next();
});

export default router;
