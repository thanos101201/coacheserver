const express = require('express');
const fetchData = require('../routers/fetchData');
const get = require('../routers/get');

const router = express.Router();

router.get('/', (req, res) => {
    get(req, res);
});

router.post('/', (req, res) => {
    fetchData(req, res);
});


module.exports = router;