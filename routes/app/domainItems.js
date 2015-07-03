var express = require('express');
var router = express.Router();

var netHelpers = require('../../modules/netHelpers/lib/netHelpers');

router.get('/', function (req, res) {
    netHelpers.performAjaxRequest('localhost', 5500, '/api/VwDomainEntities' + req.url, 'GET', null,function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send(resultObject);
    })
});

router.post('/', function (req, res) {
    netHelpers.performAjaxRequest('localhost', 5500, '/api/DatawakeDomainEntities' + req.url, 'PUT', req.body,function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send("OK");
    })
});

router.get('/domain/:vp', function (req, res) {
    var filter = {"where":{"id":req.params.vp}};
    var url = "/api/VwDomainEntities?filter=" + JSON.stringify(filter);
    var encodedUrl = encodeURI(url);

    netHelpers.performAjaxRequest('localhost', 5500, encodedUrl, 'GET', null,function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send(resultObject);
    })
});

router.delete('/:id', function (req, res) {
    netHelpers.performAjaxRequest('localhost', 5500, '/api/DatawakeDomainEntities/' + req.params.id, 'DELETE', null,function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send("OK");
    })
});

module.exports = router;