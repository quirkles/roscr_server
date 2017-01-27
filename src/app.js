import express from 'express';
import body_parser from 'body-parser';
import cookie_parser from 'cookie-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import morgan from 'morgan';

import init_routes from './routes';

import socket from './config/socket'
import {uri} from './config/mongodb';
import init_passport from './config/passport';

const app = express();

const io = socket();

io.on('connection', function(socket){
  console.log('## a user connected !');
});

const port = process.env.PORT || 5000;

const allowed_origins = ['http://localhost:3000', 'http://roscr-client.herokuapp.com', 'https://roscr-client.herokuapp.com'];

const allow_cross_domain = (req, res, next) => {
    const origin = req.headers.origin;

    res.header('Access-Control-Allow-Credentials', true);

    if (allowed_origins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
};

app.use(morgan('combined'));

app.use(cookie_parser());

// parse application/x-www-form-urlencoded
app.use(body_parser.urlencoded({ extended: false }));

// parse application/json
app.use(body_parser.json());

app.use(session({
  secret: 'jackdaws love my shiny sphinx of qwartz',
  resave: false,
  saveUninitialized: true
}));


app.use(allow_cross_domain);

mongoose.connect(uri, error => console.log(error ?
  `Problem connecting to the database: ${error}` :
  `Made connection with the database at ${uri}`
));

init_passport(app);

init_routes(app);

app.listen(port);

console.log(`Server litening on port ${port}`);
