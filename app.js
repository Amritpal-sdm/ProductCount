const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');// initialize our express app
const layout = require('express-layout');
const userView = require('./routes/userView.route'); // Imports routes for the userView
const app = express();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const mongoose = require('mongoose');
let dev_db_url = 'mongodb://localhost:27017/userView';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use('/userView', userView);
// /app.use(bodyParser.urlencoded({ extended: true }));


let port = 4201;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});
