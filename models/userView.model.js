const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserViewSchema = new Schema({
    userId: {type: String, required: true},
    viewDate: {type: Date, required: true},
    productId: {type: String, required: true},
});


// Export the model
module.exports = mongoose.model('userView', UserViewSchema);
