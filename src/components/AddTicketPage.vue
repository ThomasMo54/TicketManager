<template>
  <div class="page">
    <div class="add-ticket-section">
      <h1>Nouveau ticket</h1>
      <form class="add-ticket-form" @submit.prevent="addTicketForm">
        <h2 class="claimant-label">Demandeur</h2>
        <select class="add-ticket-input" v-model="claimant">
          <option disabled value="">Choisissez</option>
          <option v-for="cl in claimants" :key="cl.username">{{ cl.username }}</option>
        </select>

        <h2 class="description-label">Description</h2>
        <textarea rows="5" class="description-input" v-model="description"></textarea>

        <h2 class="type-label">Type</h2>
        <select class="add-ticket-input" v-model="type">
          <option disabled value="">Choisissez</option>
          <option selected>Dépannage</option>
          <option>Contrat</option>
          <option>Bureautique PC</option>
          <option>Bureautique Périphérique</option>
          <option>Interne</option>
        </select>

        <h2 class="priority-label">Priorité</h2>
        <select class="add-ticket-input" v-model="priority">
          <option disabled value="">Choisissez</option>
          <option selected>Basse</option>
          <option>Normale</option>
          <option>Haute</option>
        </select>

        <p class="error-message">{{ error }}</p>

        <input type="submit" class="add-ticket-submit" value="Confirmer"/>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AddTicketPage',
  props: {
    
  },
  data() {
    return {
      claimants: [],
      claimant: '',
      description: '',
      type: '',
      priority: '',
      error: ''
    }
  },
  mounted() {
    axios.post("https://ticket-manager-omni.herokuapp.com/user/get-users").then(res => {
      let usersObject = res['data'];
      
      for (const [key, value] of Object.entries(usersObject)) {
        let temp = {};
        temp["username"] = key;
        temp["admin"] = value;
        this.claimants.push(temp);
      }

      this.sortClaimants();
    });
  },
  methods: {
    sortClaimants: function() {
      this.claimants.sort((a, b) => (a.username > b.username) ? 1 : -1);
    },

    addTicketForm: function() {
      if(this.claimant === '' || this.description === '' || this.type === '' || this.priority === '') {
        this.error = 'Tous les champs doivent être remplis.';
      } else {
        this.error = '';

        let datas = {sender: this.$session.get("username"), claimant: this.claimant, description: this.description, type: this.type, priority: this.priority};
        console.log(datas);

        axios.post("https://ticket-manager-omni.herokuapp.com/ticket/create-ticket", datas).then(res => {
          if(res['data'] === 'Error') {
            this.error = "Une erreur est survenue lors de la création du ticket.";
          } else {
            this.$emit('inputData', 'home');
          }
        });
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page {
    display: flex;
  }

  .add-ticket-section {
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

  .add-ticket-form {
    margin-left: 5%;
    margin-right: 5%;

    display: flex;
    flex-direction: column;
  }

  .add-ticket-input {
    width: 98%;
    height: 40px;

    padding: 5px;

    font-size: 16px;
  }

  .description-input {
    width: 96%;

    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-size: 16px;

    resize: none;

    padding: 5px;
  }

  .error-message {
    color: red;
    font-size: 20px;
  }

  .add-ticket-submit {
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

  .add-ticket-submit:hover {
    background: #151d26;
  }

  @media (max-width: 800px) {
    .add-ticket-section {
      width: 80%;
    }
  }
</style>