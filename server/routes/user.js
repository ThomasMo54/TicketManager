const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const path = require('path');

const mongoose = require('mongoose');
const uri = "mongodb+srv://admin:031003Tm@ticketmanager-ahqhu.mongodb.net/TicketManager?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

let User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String,
    admin: Boolean
}));

router.use(bodyParser.json());

router.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let user = await getUser(username, password);
    
    if(user === null) {
        res.send("Error");
    } else {
        res.json({admin: user.admin});
    }
});

router.post('/create-user', async (req, res) => {
    let exists = await userExists(req.body.username);

    if(!exists) {
        let user = new User({ username: req.body.username, password: req.body.password, admin: req.body.admin });
        user.save((err, user) => {
            if(err) {
                console.error(err);
                res.send("Database error");
            } else {
                res.send("Created");
            }
        });
    } else {
        res.send("Already exists");
    }
});

router.post('/delete-user', async (req, res) => {
    let exists = await userExists(req.body.username);

    if(exists) {
        await User.deleteOne({username: req.body.username});
        res.send("Success");
    } else {
        res.send("Doesn't exist");
    }
});

router.post('/get-users', async (req, res) => {
    let users = await getUsers();
    let usersData = {};

    users.forEach(user => {
        usersData[user.username] = user.admin;
    });

    res.json(usersData);
});

async function getUser(username, password) {
    let user = await User.findOne({username: username, password: password});
    
    return user;
}

async function userExists(username) {
    let user = await User.findOne({username: username});
    
    return !(user === null);
}

async function getUsers() {
    let users = await User.find();
    
    return users;
}

module.exports = router;