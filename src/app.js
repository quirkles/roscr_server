import express from 'express';
import body_parser from 'body-parser';
import cookie_parser from 'cookie-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import nunjucks from 'nunjucks';
import morgan from 'morgan';
import path from 'path';

import init_routes from './routes';
import {uri} from './config/mongodb';
import init_passport from './config/passport';

const app = express();

const port = 5000;

const allow_cross_domain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};


app.set('view engine', 'nunjucks');

// Setup nunjucks templating engine
nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app
});

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

app.use(morgan('combined'));

app.use(allow_cross_domain);

mongoose.connect(uri, error => console.log(error ?
  `Problem connecting to the database: ${error}` :
  'Made connection with the database'
));

init_passport(app);

init_routes(app);

app.listen(port);

console.log(`Server litening on port ${port}`);
