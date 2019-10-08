express = require('express');
const app = express();
const categoryRoutes = express.Router();

let Category = require('../model/category.js');

categoryRoutes.route('/').get(function (req, res) {
  console.log("come in api")
    Category.find({ 'parentId': '0' },function (err, result){
    if(err){
      console.log(err);
    }
    else {
      console.log(result.length)
      res.json(result);
    }
  });
});

module.exports = categoryRoutes;