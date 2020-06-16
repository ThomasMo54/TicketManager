import Vue from "vue";
import Vuex from "vuex";
import VueSession from 'vue-session'
 
Vue.use(Vuex);
Vue.use(VueSession);
 
export default new Vuex.Store({
 state: {
     loggedIn: false,
     username: ''
 },
 getters: {},
 mutations: {},
 actions: {}
});