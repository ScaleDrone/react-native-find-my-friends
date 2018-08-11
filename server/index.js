const express = require('express');
const jwt = require('jsonwebtoken');
const colors = require('./colors');
const bodyParser = require('body-parser');
const cors = require('cors');
const SCALEDRONE_CHANNEL_ID = require('./scaledrone_channel_id.json');
const SCALEDRONE_CHANNEL_SECRET = require('./scaledrone_channel_secret.json');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/auth', (req, res) => {
  const {clientId, name} = req.body;
  if (!clientId || clientId.length < 1) {
    res.status(400).send('Invalid ID');
  }
  if (!name || name.length < 1) {
    res.status(400).send('Invalid name');
  }
  const token = jwt.sign({
    client: clientId,
    channel: SCALEDRONE_CHANNEL_ID,
    permissions: {
      "^observable-locations$": {
        publish: true,
        subscribe: true,
        history: 50,
      }
    },
    data: {
      name,
      color: colors.get()
    },
    exp: Math.floor(Date.now() / 1000) + 60 * 3 // expire in 3 minutes
  }, SCALEDRONE_CHANNEL_SECRET);
  res.send(token);
});

app.listen(3000, () => console.log('Server listening on port 3000'));
