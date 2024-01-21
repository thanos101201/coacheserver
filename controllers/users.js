const express = require('express');
const fetchData = require('../routers/fetchData');
const get = require('../routers/get');
const updateData = require('../routers/updateData');
const setExercise = require('../routers/setExercise');
const getCal = require('../routers/getCal');

const router = express.Router();

router.get('/', (req, res) => {
    get(req, res);
});

router.post('/', (req, res) => {
    console.log('namaste');
    fetchData(req, res);
});

router.get('/update', (req, res) => {
    updateData(req, res);
});

router.put('/', (req, res) => {
    setExercise(req, res);
})
router.get('/cal' , (req, res) => {
    getCal(req, res);
})
module.exports = router;