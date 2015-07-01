var express = require('express');
var router = express.Router();

router.get('/:vp', function (req, res) {
	var partialName = req.params.vp;
	res.render('app/' + partialName, { title: "John's ToDo List" });
});

module.exports = router;
