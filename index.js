const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./configs/db');

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('CONNECTED'));

app.get('/tiles', (req, res) => {
  db.any('SELECT name, ip, message FROM tiles ORDER BY created_at DESC LIMIT 1000')
    .then(data => res.send(data))
    .catch(error => res.send(error));
});

app.post('/io/tessellate', (req, res) => {
  console.log('RECIEVED', JSON.stringify({
    BODY: req.body,
    HEAD: req.headers
  }))
  const { ['x-forwarded-for']: ip } = req.headers;
  const { name, message } = req.body;
  const date = new Date();
  console.log('RECORDING', ip, name, message)
  db.one('INSERT INTO tiles(ip, name, message, created_at) VALUES($1, $2, $3, $4) RETURNING id, name', [ip, name, message, date])
    .then(data => res.send(`Successfully created record #${data.id} for ${data.name}.`))
    .catch(error => res.send(error));
});

let port = process.env.PORT || 8080;
http.listen(port, function(){});
