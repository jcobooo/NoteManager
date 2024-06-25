require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();

const mongoURI = process.env.COSMOS_DB_URI;

// Połączenie z MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to Azure Cosmos DB'))
  .catch(err => console.error('Error connecting to Azure Cosmos DB:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// Modele danych
const User = require('./models/User');
const Note = require('./models/Note');

// Trasy
const authRoute = require('./routes/auth');
const notesRoute = require('./routes/notes');
const userRoute = require('./routes/user');

app.use('/api/user', authRoute);
app.use('/api/notes', notesRoute);
app.use('/api/user', userRoute);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
