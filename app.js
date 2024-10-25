const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const indexRouter =require("./routes/index")
require('dotenv').config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //res.body가 객체로 인식 된다.

app.use("/api",indexRouter)
const mongoURI = process.env.LOCAL_DB_ADDRESS;
//mongoose　셋팅

mongoose
    .connect(mongoURI, { useNewUrlParser: true })
    .then(() => console.log('mongoose connected'))
    .catch((err) => console.log('DB connected error', err));
//port
app.listen(process.env.PORT || 8080, () => {
    console.log('server on');
});
