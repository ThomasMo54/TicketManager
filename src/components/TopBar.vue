<template>
  <header class="header">
    <label class="title" for="header"><a class="home-link" @click="returnToHome">TicketManager</a></label>
    <div class="auth" v-if="!isLoggedIn()">
      <button class="login" @click="login">Se connecter</button>
    </div>
    <div class="user" id="user" v-else>
      <a @click="userMenuOpen = !userMenuOpen" class="username"><h2>{{ username }}<i class="fas fa-sort-down"></i></h2></a>
      <ul class="user-menu" id="user-menu" v-if="userMenuOpen">
        <li v-for="item in userMenu" :key="item.str" @click="item.action" class="list-el">
          <a><i :class="item.icon"></i>{{ item.str }}</a>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
export default {
  name: 'TopBar',
  data(){
    return {
      username: '',
      userMenuOpen: false,
      userMenu: []
    }
  },
  mounted() {
    if(this.$session.exists()) {
      this.username = this.$session.get("username");

      if(this.$session.get("admin")) {
        this.userMenu.push({str: "Menu d'administration", action: this.admin, icon: 'fas fa-user-cog'});
      }

      this.userMenu.push({str: 'Se déconnecter', action: this.logout, icon: 'fas fa-sign-out-alt'});
    }
  },
  methods: {
    returnToHome: function() {
      this.$emit('inputData', "home");
    },

    login: function() {
      this.$emit('inputData', "login");
    },

    admin: function() {
      this.userMenuOpen = false;
      this.$emit('inputData', "admin");
    },

    isLoggedIn: function() {
      return this.$session.exists();
    },

    logout: function() {
      this.userMenuOpen = false;
      this.$emit('inputData', "logout");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    background: #2c3e50;
    width: 100%;
    height: 60px;

    display: flex;
    justify-content: space-between;
  }

  .home-link {
    cursor: pointer;
  }

  .title {
    color: white;

    margin-left: 150px;
    line-height: 60px;

    font-size: 26px;
  }

  .auth {
    margin-right: 40px;
    height: 60px;

    display: flex;
  }

  .user {
    padding-left: 70px;
    padding-right: 70px;
    height: 60px;

    background: #23313f;

    display: flex;
  }

  .login {
    margin: auto;
    width: 100px;
    height: 30px;

    background: #23313f;
    color: lightgray;
    border: 2px solid lightgray;
    border-radius: 5px;

    outline: none;
    cursor: pointer;
  }

  .login:hover {
    background: #151d26;
  }

  .username {
    color: white;

    cursor: pointer;

    display: flex;
  }

  .username h2 {
    margin: auto;
  }

  .username h2:hover i {
    color: orange;
  }

  .username i {
    margin-left: 10px;
  }

  .user-menu {
    position: fixed;
    right: 0px;
    top: 44px;

    list-style: none;
  }

  .user-menu li {
    width: 249px;
    height: 50px;

    background: #23313f;

    display: flex;

    cursor: pointer;
  }

  .user-menu li:hover {
    background: #314559;
  }

  .user-menu li:hover i{
    color: orange;
  }

  .user-menu li i{
    margin-right: 15px;
  }

  .user-menu li a {
    margin: auto;
    margin-left: 30px;

    color: white;
  }

  @media (max-width: 800px) {
    .title {
      color: white;

      margin-left: 50px;
      margin-right: 50px;
      line-height: 60px;

      font-size: 24px;
    }

    .user {
      padding-left: 20px;
      padding-right: 20px;
    }

    .username h2 {
      font-size: 18px;
    }

    .user-menu {
      width: 100%;
    }

    .user-menu li {
      width: 100%;
    }
  }
</style>
