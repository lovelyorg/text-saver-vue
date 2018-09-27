import Vue from "vue";
import Router from "vue-router";
import list from "@/components/list";
import showfile from "@/components/showfile";
import typekey from "@/components/typekey";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/:user",
      name: "typekey",
      component: typekey
    }, {
      path: "/:user/list",
      name: "list",
      component: list
    },
    {
      path: "/:user/file/:filename",
      name: "showfile",
      component: showfile
    }
  ]
});
