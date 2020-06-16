<template>
  <div id="app">
    <TopBar @inputData='redirect' :key="topBarKey"/>
    <HomePage v-if="home" @inputData='redirect' :key='homeKey'/>
    <LoginPage v-if="login" @inputData='loggedIn'/>
    <AdminPage v-if="admin"/>
    <AddTicketPage v-if="addTicket" @inputData='redirect'/>
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import HomePage from './components/HomePage.vue'
import LoginPage from './components/LoginPage.vue'
import AdminPage from './components/AdminPage.vue'
import AddTicketPage from './components/AddTicketPage.vue'

export default {
  name: 'App',
  components: {
    TopBar, HomePage, LoginPage, AdminPage, AddTicketPage
  },
  data(){
    return {
      home: true,
      login: false,
      admin: false,
      addTicket: false,
      topBarKey: 0,
      homeKey: 0
    }
  },
  methods: {
    goHome: function() {
      this.login = false;
      this.admin = false;
      this.addTicket = false;
      this.home = true;
      this.topBarKey += 1;
    },

    goLogin: function() {
      this.home = false;
      this.admin = false;
      this.addTicket = false;
      this.login = true;
    },

    goAdmin: function() {
      this.home = false;
      this.login = false;
      this.addTicket = false;
      this.admin = true;
    },

    goAddTicket: function() {
      this.home = false;
      this.login = false;
      this.admin = false;
      this.addTicket = true;
    },

    redirect: function(action) {
      if(action === "home") {
        this.goHome();
      }
      if(action === "login") {
        this.goLogin();
      }
      if(action === "admin") {
        this.goAdmin();
      }
      if(action === "addTicket") {
        this.goAddTicket();
      }
      if(action === "logout") {
        this.$session.destroy();
        this.homeKey += 1;
        this.goHome();
      }
    },

    loggedIn: function(username) {
      this.$store.state.username = username;
      this.$store.state.loggedIn = true;

      this.$session.start();
      this.$session.set("username", username);

      this.goHome();
    }
  }
}
</script>

<style>
body {
  margin: 0px;
  padding: 0px;

  background: #fafafa;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
