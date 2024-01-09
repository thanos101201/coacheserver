const express = require('express');
const fetchData = require('../routers/fetchData');
const get = require('../routers/get');
const updateData = require('../routers/updateData');

const router = express.Router();

router.get('/', (req, res) => {
    get(req, res);
});

router.post('/', (req, res) => {
    fetchData(req, res);
});

router.get('/update', (req, res) => {
    updateData(req, res);
})

module.exports = router;