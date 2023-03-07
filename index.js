const express = require('express')
const dotenv = require('dotenv');
const cors = require("cors");
const db = require("./utils/db");
const User = require("./models/User");
const csvtojson = require("csvtojson/v2");
const multer = require('multer');
const fs = require('fs');
const app = express()
app.use(express.json());
dotenv.config({ path: './.env' });
const port = process.env.PORT || 7000;

const upload = multer();
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions)) // Use this after the variable declarationd



async function uploadData(req, res) {
    console.log(req.file);
    const jsonArray = await csvtojson().fromString(req.file.buffer.toString('utf8'));

    try {
        await db.db.connect();   
        await db.db.createCollection.collection(req.file.originalname.split(".")[0]).insertMany(jsonArray);
        await db.db.disconnect();
        res.send({ isUploaded: true });
    } catch (error) {
        console.log(error);
    }
}

async function insertUser(req, res) {
    try {
        await db.db.connect();
        const user = new User.User({
            name: req.body.name,
            rollNo: req.body.rollNo,
            datasetName: req.body.datasetName,
            isAccessed: req.body.isAccessed,
        });
        await user.save();
        await db.db.disconnect();
        res.send({ isInserted: true })
    } catch (error) {
        res.send({ isInserted: false, error: error });
    }
}

async function getUser(req, res) {
    await db.db.connect()
    User.User.findOne({ rollno: rollno }, (err, user) => {
        if (err) {
            res.send({error : err, found : false});
        } else {
            res.send({userData : user, found : true});
        }
    });
    db.db.disconnect();

}


app.post('/insertUser', (req, res) => {
    insertUser(req, res);
})


app.post('/uploadDataset', upload.single('file'), (req, res) => {
    uploadData(req, res);
})

app.post('/getUser', (req, res) => {
    getUser(req, res);
})


app.get('/home', (req, res) => {
    res.status(200).send({ msg: "Connected to database API!!" });
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})