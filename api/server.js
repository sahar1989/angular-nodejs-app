const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    config = require('./DB');
//const categoryRoute = require('./routes/category.route');
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => {
        console.log('Database is connected...');
        getDataFromApi(); 
    },
    err => { console.log('Can not connect to the database' + err) }
);

const app = express();
app.use(bodyParser.json());
app.use(cors());
/*app.use(express.static(path.join(__dirname, '../dist/test-app/')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/test-app/index.html'));
});*/
//app.use('/all', categoryRoute);
app.get('/all', function (req, res) {
    console.log("come in api");
    Category.find({ 'parentId': '0' },function (err, result){
    if(err){
      console.log(err);
    }
    else {
      res.send(result);
    }
  });
});
const port = process.env.PORT || 3200;
const server = app.listen(port, function () {
    console.log('Listening on port ' + port);
});

//data variables const
const request = require('request'),
    clientId = 'FX0VBPHRLCBQPTGRXWGRERPOLL0PYUJCYLQHYV50O15XZF1V',
    clientSecret = '03OXTBF2BU4H5HU1VUQRSTQRTM2QRLUX4ITL2I5SBFSMBPXA',
    v = '20150525',
    url = "https://api.foursquare.com/v2/venues/categories";

let Category = require('./model/category.js');

//get data from foufoursquare and save in DB
function getDataFromApi() {
    request({
        url: url,
        method: 'GET',
        qs: {
            client_id: clientId,
            client_secret: clientSecret,
            v: v
        }
    }, function (err, res, body) {
        if (err) {
            console.error(err);
        }
        else {
            //save response in db 
            let data = JSON.parse(body);
            data.response.categories.forEach(element => {
                //set parent zero for first 
                saveCategory(element, "0");
            })
        }
    });
}

function saveCategory(element, parent) {
    var data = new Category();
    data.id = element.id;
    data.name = element.name;
    data.pluralName = element.pluralName;
    data.shortName = element.shortName;
    data.icon = element.icon;
    data.value = element.categories.length;
    data.parentId = parent;
    data.save().then(item => {
        console.log("item saved to database");
    })
        .catch(err => {
            console.log(err);
        });
    if (element.categories.length > 0) {
        element.categories.forEach(el => {
            saveCategory(el, data.id);
        })
    }
}