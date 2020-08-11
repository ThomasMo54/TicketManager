const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const path = require('path');

const mongoose = require('mongoose');
const uri = process.env.MONGOLAB_URI || "mongodb+srv://admin:PASSWORD@ticketmanager-ahqhu.mongodb.net/TicketManager?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

mongoose.set('useFindAndModify', false);

let Ticket = mongoose.model('Ticket', new mongoose.Schema({
    sender: String,
    add_date: String,
    claimant: String,
    solver: String,
    description: String,
    type: String,
    priority: String,
    state: String
}));

router.use(bodyParser.json());

router.post('/get-tickets', async (req, res) => {
    let datas = req.body;

    let tickets;

    if(datas.filter == 'ID') {
        tickets = [];
        tickets.push(await Ticket.findOne({_id: datas.value}));
    } else if(datas.filter == 'Date') {
        if(datas.value == 'Plus récents') {
            tickets = (await Ticket.find()).reverse();
        } else {
            tickets = await Ticket.find();
        }
    } else if(datas.filter == 'Demandeur') {
        tickets = await Ticket.find({claimant: datas.value});
    } else if(datas.filter == 'Type') {
        tickets = await Ticket.find({type: datas.value});
    } else if(datas.filter == 'Statut') {
        tickets = await Ticket.find({state: datas.value});
    } else if(datas.filter == 'Priorité') {
        tickets = await Ticket.find({priority: datas.value});
    } else {
        tickets = await Ticket.find();
    }

    res.json({tickets: tickets});
});

router.post('/create-ticket', (req, res) => {
    let datas = req.body;
    let date = new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"}).replace(/T/, ' ').replace(/\..+/, '').slice(0, -3);

    let ticket = new Ticket({sender: datas.sender, add_date: date, claimant: datas.claimant, solver: 'Personne', description: datas.description, type: datas.type, priority: datas.priority, state: 'En attente'})
    ticket.save((err, user) => {
        if(err) {
            res.send('Error');
        } else {
            res.send('Success');
        }
    });
});

router.post('/handle-ticket', (req, res) => {
    let datas = req.body;

    Ticket.findOneAndUpdate({_id: datas.id}, {solver: datas.username, state: 'Pris en charge par ' + datas.username}, (err, doc) => {
        if(err) {
            res.send("Error");
        } else {
            res.send("Success");
        }
    });
});

router.post('/unhandle-ticket', (req, res) => {
    let datas = req.body;

    Ticket.findOneAndUpdate({_id: datas.id}, {solver: 'Personne', state: 'En attente'}, (err, doc) => {
        if(err) {
            res.send("Error");
        } else {
            res.send("Success");
        }
    });
});

router.post('/close-ticket', async (req, res) => {
    let datas = req.body;

    Ticket.findOneAndUpdate({_id: datas.id}, {state: 'Clôturé'}, (err, doc) => {
        if(err) {
            res.send("Error");
        } else {
            res.send("Success");
        }
    });
});

router.post('/delete-ticket', async (req, res) => {
    await Ticket.deleteOne({_id: req.body.id});
    res.send("Success");
});

module.exports = router;
