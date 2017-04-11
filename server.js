var express = require('express');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
// var Cloudant = require('cloudant');
// var request = require('request');
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);
app.use(bodyParser.json());
// Load the Cloudant library.
var Cloudant = require('cloudant');

var me = 'dinesh123'; // Set this to your own account
var password = 'admin123';

// Initialize the library with my account.
var cloudant = Cloudant({account:me, password:password});

// cloudant.db.list(function(err, allDbs) {
//     console.log('All my databases: %s', allDbs.join(', '))
// });

var db = cloudant.db.use("pizza_bot");
var db1 = cloudant.db.use("user-db");



app.get('/product', function (req, res) {
    console.log('Got a get request.');
    db.list(function(err, data) {
        console.log(data);
        // res.json(data);
        res.send(data);
    });

});

app.get('/product/:pizzaName',function(req,res) {
    db.find({selector: {pizzaName: req.params.pizzaName}}, function (er, result) {
        console.log(result);
        res.json(result);
    })
});

// Insert User Details
app.post('/product', function (req, res) {
    var vdetails = {
        "Quantity": req.body.quantity,
        "address": req.body.Address,
        "phone_number": req.body.phoneNumber
    }
//inserting data into cloudant...

    db1.insert({vdetails}, vdetails.phone_number, function (err, body, header) {
        if (err) {
            return console.log('[db.insert] ', err.message);
        }
        res.json(result);
        console.log('You have inserted the details.');
        console.log(body);
    });

});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
})



