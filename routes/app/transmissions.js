var express = require('express');
var router = express.Router();

var netHelpers = require('../../modules/netHelpers/lib/netHelpers');

router.get('/', function (req, res) {
    netHelpers.performLoopbackAjaxRequest('/api/VwXmitLogs' + req.url, 'GET', null,function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send(resultObject);
    })
});

router.get('/recipient/:vp', function (req, res) {
    var filter = {"where":{"recipientId":req.params.vp}};
    var url = "/api/VwXmitLogs?filter=" + JSON.stringify(filter);
    var encodedUrl = encodeURI(url);

    netHelpers.performLoopbackAjaxRequest(encodedUrl, 'GET', null,function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send(resultObject);
    })
});


router.post('/', function (req, res) {
    netHelpers.performLoopbackAjaxRequest('/api/DatawakeXmits' + req.url, 'PUT', req.body,function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send("OK");
    })
});

router.delete('/:id', function (req, res) {
    netHelpers.performLoopbackAjaxRequest('/api/DatawakeXmits/' + req.params.id, 'DELETE', null,function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send("OK");
    })
});

module.exports = router;