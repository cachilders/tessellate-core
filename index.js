const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./configs/db');

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('CONNECTED'));

app.post('/io/tessellate', (req, res) => {
  const { ip, name, message } = req.body;
  const date = new Date();
  db.one('INSERT INTO tiles(ip, name, message, created_at) VALUES($1, $2, $3, $4) RETURNING id', [ip, name, message, date])
    .then(data => res.send(`Successfully created record #${data.id}.`))
    .catch(error => res.send(error));
});

let port = process.env.PORT || 8080;
http.listen(port, function(){});
