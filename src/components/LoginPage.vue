<template>
  <div class="page">
    <div class="login-section">
      <h1>Connexion</h1>
      <form class="login-form" @submit.prevent="loginForm">
        <h2 class="username-label">Nom d'utilisateur</h2>
        <input type="text" class="login-input" v-model="username"/>

        <h2 class="password-label">Mot de passe</h2>
        <input type="password" class="login-input" v-model="password"/>

        <p class="error-message">{{ error }}</p>

        <input type="submit" class="login-submit" value="Confirmer"/>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginPage',
  props: {
    
  },
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    loginForm: function() {
      axios.post("https://ticket-manager-omni.herokuapp.com:80/user/login", {username: this.username, password: this.password}).then(res => {
        console.log(res['data']);
        if(res['data'] === 'Error') {
          this.error = "Le nom d'utilisateur ou le mot de passe est incorrect.";
        } else {
          this.$emit('inputData', this.username);
          this.$session.set('admin', res['data'].admin);
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page {
    display: flex;
  }

  .login-section {
    margin: auto;
    margin-top: 110px;
    background: white;

    width: 30%;

    border-radius: 25px;
    box-shadow: 5px 5px 5px lightgrey;

    display: flex;
    flex-direction: column;
  }

  h1 {
    padding-top: 15px;
    padding-left: auto;
    padding-right: auto;
    margin-top: 0px;
    margin-bottom: 0px;
    width: 100%;
    height: 50px;

    text-align: center;
    color: white;

    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    background: #46627F;
  }

  .login-form {
    margin-left: 5%;
    margin-right: 5%;

    display: flex;
    flex-direction: column;
  }

  .login-input {
    width: 98%;
    height: 28px;

    padding: 5px;

    font-size: 18px;
  }

  .error-message {
    color: red;
    font-size: 20px;
  }

  .login-submit {
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
    margin-bottom: 30px;
    width: 40%;
    height: 40px;

    background: #2c3e50;
    color: white;

    font-size: 20px;

    border-radius: 5px;

    border: none;
    outline: none;
    cursor: pointer;

    transition: .4s;
  }

  .login-submit:hover {
    background: #151d26;
  }

  @media (max-width: 800px) {
    .login-section {
      width: 80%;
    }
  }
</style>