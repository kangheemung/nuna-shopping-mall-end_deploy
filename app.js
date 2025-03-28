const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const indexRouter = require('./routes/index');
require('dotenv').config();
const allowedOrigins = ['http://localhost:3000', 'http://localhost:8080', 'https://stellar-custard-0ecaf1.netlify.app'];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: true,
};
// app.use(
//   cors({
//       origin: ["http://localhost:8080", "https://stellar-custard-0ecaf1.netlify.app"],
//       methods: ["GET", "POST", "PUT", "DELETE"],
//       credentials: true,
//   })
// );
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
// app.use((req, res, next) => {
//     res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
//     next();
// });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //res.body가 객체로 인식 된다.
app.use('/api', indexRouter);
const mongoURI = process.env.LOCAL_DB_ADDRESS;
//mongoose 셋팅

mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('mongoose connected'))
    .catch((err) => console.log('DB connected fail', err));
//port
app.listen(process.env.PORT || 8080, () => {
    console.log('server on');
});
