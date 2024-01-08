const express = require('express');
const cors = require('cors');
const user = require('../controllers/users');
const login = require('../routers/login');
const app = express();
app.use(cors({
    origin: '*',
    methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE'
    ]
}));

require('../db/db');

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Welcome');
})

app.use('/user', (req, res) => {
   user(req, res); 
});

app.get('/login', (req, res) => {
    login(req, res);
})

app.listen(3001, () => {
    console.log('Server started');
});