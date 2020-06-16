<template>
  <div class="page">
    <div class="sort-tickets" v-if="this.tickets.length > 0">
      <h2 class="sort-title">Trier par :</h2>
      <select class="sort-by" v-model="sortBy">
        <option selected>Date</option>
        <option>ID</option>
        <option>Demandeur</option>
        <option>Type</option>
        <option>Statut</option>
        <option>Priorité</option>
      </select>

      <select class="sort-option" v-model="sortOption" v-if="sortBy != 'ID' && sortBy != 'Demandeur' && sortBy != ''">
        <!-- Date -->
        <option v-if="sortBy == 'Date'">Plus récents</option>
        <option v-if="sortBy == 'Date'">Plus anciens</option>

        <!-- Type -->
        <option v-if="sortBy == 'Type'">Dépannage</option>
        <option v-if="sortBy == 'Type'">Contrat</option>
        <option v-if="sortBy == 'Type'">Bureautique PC</option>
        <option v-if="sortBy == 'Type'">Bureautique Périphérique</option>
        <option v-if="sortBy == 'Type'">Interne</option>

        <!-- Statut -->
        <option v-if="sortBy == 'Statut'">En attente</option>
        <option v-if="sortBy == 'Statut'">Pris en charge</option>
        <option v-if="sortBy == 'Statut'">Clôturé</option>

        <!-- Priorité -->
        <option v-if="sortBy == 'Priorité'">Basse</option>
        <option v-if="sortBy == 'Priorité'">Normale</option>
        <option v-if="sortBy == 'Priorité'">Haute</option>
      </select>
      
      <select class="sort-claimant" v-model="sortOption" v-if="sortBy == 'Demandeur'">
        <option v-for="user in users" :key="user.username">{{ user.username }}</option>
      </select>

      <input type="text" class="sort-id" v-model="sortOption" v-if="sortBy == 'ID'"/>

      <button class="sort-submit" @click='getFilteredTickets()'>Trier</button>
    </div>
    <div class="tickets" v-if="this.$session.exists()">
      <p class="error-message">{{ error }}</p>
      <ul class="ticket-list">
        <li class="ticket" v-for="(ticket, index) in tickets" :style="ticket.state != 'Clôturé' ? {'cursor': 'pointer'} : {'cursor': 'default'}" :key="ticket._id">
          <div class="ticket-header" @click="ticketClicked(index)">
            <h2 class="priority" :style="ticket.priority === 'Basse' ? {'background': '#0B0'} : ticket.priority === 'Normale' ? {'background': 'orange'} : {'background': 'red'}">Priorité {{ ticket.priority }}</h2>
            <h2 class="date">{{ ticket.add_date }}</h2>
          </div>
          <div class="ticket-body" @click="ticketClicked(index)">
            <p class="ticket-id"><strong>ID : </strong>{{ ticket._id }}</p>
            <p class="claimant"><strong>Demandeur : </strong>{{ ticket.claimant }}</p>
            <p class="type"><strong>Type : </strong>{{ ticket.type }}</p>
            <p class="description"><strong>Description : </strong>{{ ticket.description }}</p>
            <p class="state"><strong>Statut : </strong><span>{{ ticket.state }}</span></p>
          </div>
          <div class="ticket-buttons" v-if="ticket.state != 'Clôturé'" :id="index">
            <button class="handle" v-if="!isSolver(ticket.solver)" @click="handleTicket(index)">Prendre en charge</button>
            <button class="unhandle" v-else @click="unhandleTicket(index)">Ne plus prendre en charge</button>
            <button class="close" v-if="isSolver(ticket.solver)" @click="closeTicket(index)">Clôturer</button>
            <button class="delete" v-if="isAdmin()" @click="deleteTicket(index)">Supprimer</button>
          </div>
        </li>
      </ul>
    </div>
    <div class="add-ticket-button" v-if="isAdmin()" @click="addTicket">
      <img src="@/assets/Add_ticket.png" class="add-icon" width="30" height="30"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HomePage',
  data(){
    return {
      username: '',
      users: [],
      sortBy: '',
      sortOption: '',
      tickets: [],
      openButtonsIndex: -1,
      error: ''
    }
  },
  mounted() {
    this.username = this.$session.get('username');
    
    axios.post("https://ticket-manager-omni.herokuapp.com:80/ticket/get-tickets", {number: 50}).then(res => {
      if(res['data'] === 'Error') {
        this.error = 'Une erreur est survenue lors de la récuperation des tickets.';
      } else {
        this.error = '';
        this.tickets = res['data'].tickets;
        this.tickets.reverse();
      }
    });

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
    isAdmin: function() {
      return this.$session.get("admin");
    },

    isSolver: function(ticketSolver) {
      return ticketSolver === this.username;
    },

    addTicket: function() {
      this.$emit('inputData', "addTicket");
    },

    ticketClicked: function(index) {
      let ticket = document.getElementById(index).style;

      if(ticket.display === 'block') {
        document.getElementById(index).style = "display: none";
        this.openButtonsIndex = -1;
      } else {
        document.getElementById(index).style = "display: block";
        if(this.openButtonsIndex != -1) {
          document.getElementById(this.openButtonsIndex).style = "display: none";
        }
        this.openButtonsIndex = index;
      }
    },

    handleTicket: function(index) {
      axios.post("https://ticket-manager-omni.herokuapp.com:80/ticket/handle-ticket", {id: this.tickets[index]._id, username: this.username}).then(res => {
        if(res['data'] === "Success") {
          this.tickets[index].solver = this.username;
          this.tickets[index].state = 'Pris en charge par ' + this.username;
        } 
      });
    },

    unhandleTicket: function(index) {
      axios.post("https://ticket-manager-omni.herokuapp.com:80/ticket/unhandle-ticket", {id: this.tickets[index]._id}).then(res => {
        if(res['data'] === "Success") {
          this.tickets[index].solver = 'Personne';
          this.tickets[index].state = 'En attente';
        } 
      });
    },

    closeTicket: function(index) {
      axios.post("https://ticket-manager-omni.herokuapp.com:80/ticket/close-ticket", {id: this.tickets[index]._id}).then(res => {
        if(res['data'] === "Success") {
          this.tickets[index].state = 'Clôturé';
        } 
      });
    },

    deleteTicket: function(index) {
      if(confirm('Etes-vous sûr de vouloir supprimer ce ticket ?')) {
        axios.post("https://ticket-manager-omni.herokuapp.com:80/ticket/delete-ticket", {id: this.tickets[index]._id}).then(res => {
          if(res['data'] === "Success") {
            this.tickets.splice(index, 1)
          } 
        });
      }
    },

    getFilteredTickets: function() {
      axios.post("https://ticket-manager-omni.herokuapp.com:80/ticket/get-tickets", {number: 50, filter: this.sortBy, value: this.sortOption}).then(res => {
        if(res['data'] === 'Error') {
          this.error = 'Une erreur est survenue lors de la récuperation des tickets.';
        } else {
          this.error = '';
          this.tickets = res['data'].tickets;
          this.sortOption = '';
          this.openButtonsIndex = -1;
        }
      });
    },

    sortUsers: function() {
      this.users.sort((a, b) => (a.username > b.username) ? 1 : -1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .add-ticket-button {
    position: fixed;
    right: 40px;
    bottom: 35px;

    background: #384f66;
    color: white;

    border-radius: 50px;
    cursor: pointer;
  }

  .add-ticket-button:hover {
    background: #23313f;
  }

  .add-icon {
    margin: 15px;
    margin-bottom: 12px;
  }

  .sort-tickets {
    display: flex;
    align-items: center;

    margin-top: 70px;
    margin-left: 20px;
  }

  .sort-title {
    margin-right: 10px;

    font-size: 18px;
  }

  .sort-by {
    margin-right: 10px;
    height: 35px;

    font-size: 16px;
  }

  .sort-option, .sort-claimant {
    margin-right: 10px;
    height: 35px;

    font-size: 16px;
  }

  .sort-id {
    margin-right: 10px;

    height: 29px;
    font-size: 16px;
  }

  .sort-submit {
    margin-right: 20px;
    height: 35px;

    font-size: 16px;
  }

  .ticket-list {
    margin-top: 10px;
    padding: 0;

    list-style: none;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .ticket {
    width: 80%;
    margin-bottom: 50px;
    background: white;

    border-radius: 5px;
    box-shadow: 5px 5px 5px lightgrey;

    cursor: pointer;
  }

  .ticket-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding-left: 20px;
    padding-right: 20px;
    margin-top: 0px;
    margin-bottom: 0px;

    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background: #46627F;
    color: white;

    font-size: 14px;
  }

  .ticket-body {
    padding-left: 20px;
    padding-right: 20px;

    font-size: 18px;
  }

  .priority {
    padding: 3px;
    padding-left: 5px;
    padding-right: 5px;

    border-radius: 5px;
  }

  .ticket-buttons {
    padding-left: 20px;
    padding-right: 20px;

    margin-bottom: 10px;

    display: none;
  }

  .ticket-buttons button {
    margin-right: 10px;
    margin-bottom: 10px;
    border: none;
    border-radius: 5px;
    outline: none;
    cursor: pointer;
    height: 40px;
    font-size: 16px;
    padding: 8px;
    transition: .3s;
  }

  .handle:hover, .unhandle:hover {
    background: lightgrey;
  }

  .close {
    background: #0B0;
    color: white;
  }

  .close:hover {
    background: green;
  }

  .delete {
    background: #FF3232;
    color: white;
  }

  .delete:hover {
    background: #D82B2B;
  }

  @media (max-width: 800px) {
    .ticket-header {
      font-size: 12px;
    }

    .ticket-body {
      font-size: 16px;
    }
  }
</style>