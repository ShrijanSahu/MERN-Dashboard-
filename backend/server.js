// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Data = require('./models/Data');
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://Shrijan:Latasahu1234@cluster0.a28tcf3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define API routes
app.get('/api/data', async (req, res) => {
  const data = await Data.find({});
  res.json(data);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
