var express = require('express');
var router = express.Router();

var netHelpers = require('../modules/netHelpers/lib/netHelpers');

router.get('/', function (req, res) {
    res.render('login', { title: 'Login'});
});

router.post('/', function (req, res) {
    netHelpers.performLoopbackAjaxRequest('/api/users/login', 'POST', req.body, function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send('Unauthorized');
            return;
        }
        req.session.loopbackId = resultObject.id;
        req.session.userId = resultObject.userId;
        res.status(200).send(resultObject);
    });
});

router.post('/signup', function (req, res) {
    netHelpers.performLoopbackAjaxRequest('/api/users', 'POST', req.body, function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send('Success!');
    })
});

router.get('/signup', function (req, res) {
    res.render('signup', { title: 'Signup'});
});

module.exports = router;
