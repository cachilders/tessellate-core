const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./configs/db');

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('CONNECTED'));

app.post('/io/tessellate', (res, req) => {
  const { ip, name, message } = res.body;
  db.one('INSERT INTO tiles(ip, name, message) VALUES($1, $2, $3) RETURNING id', [ip, name, message])
    .then(data => res.send(`Successfully created record #${data.id}.`))
    .catch(error => res.send(error));
});

let port = process.env.PORT || 8080;
http.listen(port, function(){});
