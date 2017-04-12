var express = require('express');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
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
var db = cloudant.db.use("pizza_bot");
var db1 = cloudant.db.use("user-db");
// cloudant.db.list(function(err, allDbs) {
//     console.log('All my databases: %s', allDbs.join(', '))
// });


// Get List of products Available
app.get('/product', function (req, res) {
    console.log('Got a get request.');
    var data = {};
    db.list(function(err, result) {
        console.log("get list req");
        if(result.length != 0){
            data["error"] = 0;
            data["products"] = result;
            res.json(data);
        }else{
            data["error"] = 1;
            data["products"] = "No Pizzas found..";
            res.json(data);
        }
    });

});

// Get details of the product Selected
app.get('/product/:pizzaName',function(req,res) {
    var data = {};
    db.find({selector: {pizzaName: req.params.pizzaName}}, function (err, result) {
        console.log(result);
        // res.json(result);
        if(result.length != 0){
            data["error"] = 0;
            data["products"] = result;
            res.json(data);
        }else{
            data["error"] = 1;
            data["products"] = "No Pizzas found..";
            res.json(data);
        }
    });
});

// Insert User Details
app.post('/product', function (req, res) {
    var vdetails = {
        "Quantity": req.body.quantity,
        "address": req.body.Address,
        "phone_number": req.body.phoneNumber
    };
    var data ={};

//inserting data into cloudant...
    if(!!vdetails.Quantity && !!vdetails.address && !!vdetails.phone_number){
        db1.insert({vdetails}, vdetails.phone_number, function (err, result) {
            if (!!err) {
                data["error"] = 1;
                data["Products"] = result;
            } else{
                // res.json(result);
                // console.log('You have inserted the details.');
                // console.log(result);
                data["error"] = 0;
                data["Products"] = result;
                console.log("Address Details inserted");
            }
            res.json(data);
        });
    }


});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});



