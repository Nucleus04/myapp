const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/user');
const db = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = new User({ username, password });

  user.save((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to insert user' });
    }

    return res
    .status(201)
    .json({ message: 'User created successfully' });
});
});

app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});