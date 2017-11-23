require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const db = require('./db');

app.use(bodyParser.json());

app.use(express.static('build'));

app.get('/api/tiles', (req, res) => {
  db.any('SELECT id, name, message FROM tiles ORDER BY created_at DESC LIMIT 1025')
    .then(data => res.send(data))
    .catch(error => res.send(error));
});

app.post('/io/tessellate', (req, res) => {
  const { ['x-forwarded-for']: ip } = req.headers;
  const { name, message } = req.body;
  const date = new Date();
  db.one('INSERT INTO tiles(ip, name, message, created_at) VALUES($1, $2, $3, $4) RETURNING id, name', [ip, name.trim(), message.trim(), date])
    .then(data => res.send(`Successfully created record #${data.id} for ${data.name}.`))
    .catch(error => res.send(error));
});

let port = process.env.PORT || 8080;
http.listen(port, function(){});
