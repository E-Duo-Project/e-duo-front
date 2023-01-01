import Vue from "vue";
import Vuex from "vuex";
import userStore from "@/store/modules/userStore";
import createPersistedState from "vuex-persistedstate";
import courseStore from "@/store/modules/courseStore";
import attendanceStore from "@/store/modules/attendanceStore";
import teacherStore from "@/store/modules/teacherStore";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    userStore,
    courseStore,
    attendanceStore,
    teacherStore,
  },
  plugins: [
    createPersistedState({
      paths: ['userStore'],
    })
  ]
})
    
