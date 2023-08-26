const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewres/error');
const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(router);

app.use(errors());
app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/testdb')
  .then(() => console.log('Connected to the data base'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
