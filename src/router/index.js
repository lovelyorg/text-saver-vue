import Vue from "vue";
import Router from "vue-router";
import list from "@/components/list";
import showfile from "@/components/showfile";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "list",
      component: list
    },
    {
      path: "/file/:filename",
      name: "showfile",
      component: showfile
    }
  ]
});
