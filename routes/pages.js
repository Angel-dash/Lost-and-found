const express = require("express");

const router = express.Router();

router.get('/', (req, res) =>
{
    res.render('index')
})
router.get('/postandclaim', (req, res) =>
{
    res.render('/postandclaim')
})


module.exports = router;