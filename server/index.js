const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const bodyParser = require('body-parser')
const metaCentraland = require('./routes/metaCentraland')
const {
    owner
} = require('./blockChain');


const app = express();
const PORT = 5000;
// const CONNECTION_URL = 'mongodb+srv://ran:ran123321@cluster0.zkaeg.mongodb.net/metaCentraland';
const CONNECTION_URL = 'mongodb+srv://ron:new1029@cluster0.zkaeg.mongodb.net/metaCentraland';
const db = mongoose.connection;

app.use(cors());
app.use(express.json());

app.use(bodyParser.json({
    limit: "25mb",
    extended: true

}));
app.use(bodyParser.urlencoded({
    limit: "25mb",
    extended: true
}));




//conected to db
mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

db.on('error', function (e) {
    console.log(e);
});

db.once('open', function () {
    console.log('conncted to database')
});

app.use("/metaCentraland", metaCentraland);
app.listen(PORT, () => console.log(`server listening on port ${PORT}`))
app.use(express.urlencoded({
    extended: true
}));

///init owner///
db.createCollection('users', function (err, res) {
    if (err.codeName == 'NamespaceExists') {
        console.log("Already Exists Collection");
        return;
    }
    db.collection("users").insertOne(owner);
    console.log('data saved');
})