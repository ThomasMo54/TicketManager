const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

let ticket = require('./server/routes/ticket');
let user = require('./server/routes/user');

app.use(cors());
app.use(express.static(__dirname + "/dist/"));
app.use('/ticket', ticket);
app.use('/user', user);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/dist/index.html")
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});