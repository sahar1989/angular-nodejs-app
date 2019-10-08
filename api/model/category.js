const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Category = new Schema({
    id: {
        type: String
    },
    name: {
        type: String
    },
    pluralName: {
        type: String
    },
    shortName: {
        type: String
    },
    icon: {
        type: Object
    },
    value: {
        type: Number
    },
    parentId: {
        type: String
    }
}, {
    collection: 'category'
});

module.exports = mongoose.model('Category', Category);