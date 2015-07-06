var express = require('express');
var router = express.Router();

var netHelpers = require('../../modules/netHelpers/lib/netHelpers');

router.get('/', function (req, res) {
    netHelpers.performLoopbackAjaxRequest('/api/DatawakeDomains' + req.url, 'GET', null,function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send(resultObject);
    })
});

router.post('/', function (req, res) {
    netHelpers.performLoopbackAjaxRequest('/api/DatawakeDomains' + req.url, 'PUT', req.body,function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send("OK");
    })
});

router.delete('/:id', function (req, res) {
    netHelpers.performLoopbackAjaxRequest('/api/DatawakeDomains/' + req.params.id, 'DELETE', null,function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send("OK");
    })
});


module.exports = router;