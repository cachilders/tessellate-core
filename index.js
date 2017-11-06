const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./configs/db');

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('CONNECTED'));

app.post('/io/tessellate', (req, res) => {
  const { ['x-forwarded-for']: ip } = req.headers;
  const { name, message } = req.body;
  const date = new Date();
  console.log(ip, name, message)
  db.one('INSERT INTO tiles(ip, name, message, created_at) VALUES($1, $2, $3, $4) RETURNING id, name', [ip, name, message, date])
    .then(data => res.send(`Successfully created record #${data.id} for ${data.name}.`))
    .catch(error => res.send(error));
});

let port = process.env.PORT || 8080;
http.listen(port, function(){});
