<template>
  <div class="page">
    <div class="add-user-menu">
      <div class="add-user">
        <h1 class="add-user-title">Add User</h1>
        <form class="add-user-form" @submit.prevent="addUserForm">
          <h2 class="username-label">Nom d'utilisateur</h2>
          <input type="text" class="add-user-input" v-model="username"/>

          <h2 class="password-label">Mot de passe</h2>
          <input type="password" class="add-user-input" v-model="password"/>

          <h2 class="confirm-password-label">Confirmer le mot de passe</h2>
          <input type="password" class="add-user-input" v-model="confirmPassword"/>

          <div class="admin-input">
            <input type="checkbox" id="isadmin-checkbox" class="isadmin-checkbox" v-model="adminChecked"/>
            <label for="isadmin-checkbox" class="checkbox-label">Administrateur</label>
          </div>

          <p class="error-message" v-if="error != ''">{{ error }}</p>
          <p class="success-message" v-if="success">Utilisateur créé avec succès.</p>

          <input type="submit" class="add-user-submit" value="Confirmer"/>
        </form>
      </div>
    </div>
    <div class="user-list-menu">
      <div class="user-list">
        <h1 class="user-list-title">Liste des utilisateurs</h1>
        <ul class="user-list">
          <li class="user-element" v-for="(user, index) in users" :key="index">
            <div class="user-div">
              <h2 class="user-username">
                {{ user.username }}<br>
                <span class="user-admin admin" v-if="user.admin">Admin</span>
                <span class="user-admin not-admin" v-else>User</span>
              </h2>
              <h2 class="delete-user" @click="deleteUser(user.username, index)"><i class="fas fa-times"></i></h2>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AdminPage',
  props: {
    
  },
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      adminChecked: false,
      error: '',
      success: false,
      users: []
    }
  },
  mounted() {
    axios.post("https://ticket-manager-omni.herokuapp.com:80/user/get-users").then(res => {
      let usersObject = res['data'];
      
      for (const [key, value] of Object.entries(usersObject)) {
        let temp = {};
        temp["username"] = key;
        temp["admin"] = value;
        this.users.push(temp);
      }

      this.sortUsers();
    });
  },
  methods: {
    addUserForm: function() {
      this.success = false;
      this.error = '';

      if(this.username != '' && this.password != '' && this.confirmPassword != '') {
        if(this.password == this.confirmPassword) {
          axios.post("https://ticket-manager-omni.herokuapp.com:80/user/create-user", {username: this.username, password: this.password, admin: this.adminChecked}).then(res => {
            if(res['data'] === 'Created') {
              this.users.push({username: this.username, admin: this.adminChecked});
              this.sortUsers();
              this.success = true;
              this.username = '';
              this.password = '';
              this.confirmPassword = '';
              this.adminChecked = false;
            } else if(res['data'] === 'Already exists') {
              this.error = "Ce nom d'utilisateur existe déjà.";
            } else if(res['data'] === 'Database error') {
              this.error = 'Erreur de base de données.';
            }
          });
        } else {
          this.error = "Les mots de passe ne correspondent pas."
        }
      } else {
        this.error = "Tous les champs doivent être remplis."
      }
    },
    deleteUser: function(user, index) {
      if(confirm('Etes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        axios.post("https://ticket-manager-omni.herokuapp.com:80/user/delete-user", {username: user}).then(res => {
          if(res['data'] === "Success") {
            this.users.splice(index, 1);
          }
      });
      }
    },
    sortUsers: function() {
      this.users.sort((a, b) => (a.username > b.username) ? 1 : -1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page {
    display: flex;
  }

  .add-user-menu, .user-list-menu {
    margin: auto;
    margin-top: 110px;

    width: 30%;

    background: white;

    border-radius: 25px;
    box-shadow: 5px 5px 5px lightgrey;
  }

  .add-user-title, .user-list-title {
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

  .add-user-form {
    margin-left: 5%;
    margin-right: 5%;

    display: flex;
    flex-direction: column;
  }

  .add-user-input {
    width: 98%;
    height: 28px;

    padding: 5px;

    font-size: 18px;
  }

  .admin-input {
    margin-top: 40px;
    font-size: 20px;
  }

  .isadmin-checkbox {
    -ms-transform: scale(1.8); /* IE */
    -moz-transform: scale(1.8); /* FF */
    -webkit-transform: scale(1.8); /* Safari and Chrome */
    -o-transform: scale(1.8); /* Opera */
    transform: scale(1.8);

    cursor: pointer;
  }

  .checkbox-label {
      margin-left: 15px;

      cursor: pointer;
  }

  .error-message {
    color: red;
    font-size: 20px;
  }

  .success-message {
    color: green;
    font-size: 20px;
  }

  .add-user-submit {
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
    margin-bottom: 50px;
    width: 40%;
    height: 40px;

    background: #46627F;
    color: white;

    font-size: 20px;

    border-radius: 5px;

    border: none;
    outline: none;
    cursor: pointer;

    transition: .4s;
  }

  .add-user-submit:hover {
    background: #2c3e50;
  }

  .user-div {
    display: flex;
    justify-content: space-between;
  }

  .user-admin {
    font-size: 16px;;
  }

  .admin {
    color: red;
  }

  .not-admin {
    color: green;
  }

  .delete-user {
    margin-right: 20px;
    display: none;
    cursor: pointer;
  }

  .user-div:hover .delete-user {
    display: block;
  }

  .delete-user:hover {
    color: red;
  }

  @media (max-width: 800px) {
    .page {
      display: block;
    }

    .add-user-menu, .user-list-menu {
      width: 80%;
    }
  }
</style>