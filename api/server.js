const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    app = express(),
    config = require('./DB'),
    port = process.env.PORT || 3200;

//API information
const request = require('request'),
    clientId = '',//your clinet id
    clientSecret = '',//your secret id 
    v = '20150525',
    url = "https://api.foursquare.com/v2/venues/categories";

//model 
let Category = require('./model/category.js');

mongoose.Promise = global.Promise;
app.use(bodyParser.json());
app.use(cors());

/*app.use(express.static(path.join(__dirname, '../dist/test-app/')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/test-app/index.html'));
});
//const categoryRoute = require('./routes/category.route');
//app.use('/all', categoryRoute);*/

const server = app.listen(port, function () {
    console.log('Listening on port ' + port);
});

mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    conncetion => {
        console.log('Database is connected...');
    },
    err => { console.log('Can not connect to the database' + err) }
);

let isSave = false;
//get data from foursquare and save in DB
app.get('/get', function (req, res) {
    request({
        url: url,
        method: 'GET',
        qs: {
            client_id: clientId,
            client_secret: clientSecret,
            v: v
        }
    }, function (err, result, body) {
        if (err) {
            console.error(err);
            res.send(null);
        }
        else {
            //save response in db 
            let data = JSON.parse(body).response.categories;
            if (data != null && data.length > 0) {
                insert_to_db(data);
                res.send(true);
                /*Category.find({ 'parentId': '0' }, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.send(result);
                    }
                });*/
            }
        }
    });
});

app.get('/load', function (req, res) {
    Category.find({ 'parentId': '0' }, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

function insert_to_db(data) {
    data.forEach(element => {
        //set parent zero for first 
        save_data(element, "0");
    });
}

function save_data(element, parent) {
    var data = new Category();
    data.id = element.id;
    data.name = element.name;
    data.pluralName = element.pluralName;
    data.shortName = element.shortName;
    data.icon = element.icon;
    data.value = element.categories.length;
    data.parentId = parent;
    data.save().then(item => {
        // console.log("item saved to database");
    })
        .catch(err => {
            console.log(err);
        });
    if (element.categories.length > 0) {
        element.categories.forEach(el => {
            save_data(el, data.id);
        })
    }
}