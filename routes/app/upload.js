var express = require('express');
var router = express.Router();
var fs = require('fs');

var netHelpers = require('netHelpers');

//extract the domain. A Domain has the following attributes: id, name, description, teamId
function getDomainFromCSV2 (csv){
    var csvLines=csv.split("\n");

    //line 0 is the header, goto line 1 to get the values we need
    var csvItems=csvLines[1].split(";");
    var domainJSON = '{"id":' + csvItems[0]
        + ',"name":' + csvItems[1]
        + ',"description":' + csvItems[2]
        + ',"teamId":' + csvItems[3]
        + '}';

    return domainJSON;
}

//extract the domainItems.A DomainItem has the following attributes: domainEntityId, featureType, featureValue, domainId
function getDomainItemsFromCSV (csv){
    var csvLines=csv.split("\n");
    var domainItems = [];
    var item= null;

    for(var i=1;i<csvLines.length;i++){
        var currentItem=csvLines[i].split(";");
        item = {domainEntityId: currentItem[4],
            featureType: currentItem[5],
            featureValue: currentItem[6],
            domainId: currentItem[0]
        };
        domainItems.push(item);
    }

    return domainItems;

}

//extract the domainItems.A DomainItem has the following attributes: domainEntityId, featureType, featureValue, domainId
function getDomainItemsFromCSV2 (csv){
    var csvLines=csv.split("\n");
    var domainItemsJSON = "";
    var itemJSON= "";

    for(var i=1;i<csvLines.length;i++){
        var currentItem=csvLines[i].split(";");



        if (currentItem.length == 8) {
            itemJSON = '{"domainEntityId":' + currentItem[4]
                + ',"featureType":' + currentItem[5]
                + ',"featureValue":' + currentItem[6]
                + ',"domainId":' + currentItem[0]
                + '}';

            if(i != 1 && i < csvLines.length){
                domainItemsJSON = domainItemsJSON.concat(",")
            }
            domainItemsJSON = domainItemsJSON.concat(itemJSON);
        }

    }
    if (domainItemsJSON != ""){
        domainItemsJSON = "[" + domainItemsJSON + "]";
    }

    return domainItemsJSON;
}

//var csv is the CSV file with headers
function csvJSON(csv){
    var lines=csv.split("\n");
    var result = [];
    var headers=lines[0].split(";");

    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}

router.post('/', function (req, res) {

    // We are able to access req.files.file thanks to
    // the multiparty middleware
    var file = req.files.file;

    var domainFile = fs.readFileSync(file.path.toString(),'utf8');

    var domainJSON = getDomainFromCSV2(domainFile);
    var domainItemJSON = getDomainItemsFromCSV2(domainFile);

    //We have to parse the csv into the Domain and the DomainItems.  Domain must be created first, then we can create the domain items.
    netHelpers.performAjaxRequest('localhost', 5500, '/api/DatawakeDomains' + req.url, 'PUT', domainJSON ,function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        netHelpers.performAjaxRequest('localhost', 5500, '/api/DatawakeDomainEntities' + req.url, 'PUT', domainItemJSON ,function (resultObject) {
            if (resultObject.error) {
                res.status(resultObject.error.status).send(resultObject.error.message);
                return;
            }
            res.status(200).send("OK");
        })
    })
});

module.exports = router;