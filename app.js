/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000, BASE_PATH = 'localhost' } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb ', {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
})
  .then(() => console.log('База данных подключена.'))
  .catch((err) => console.log('DB error', err));

app.use((req, res, next) => {
  try {
    const loggedInUserId = '64de2e00e8b9dd90196255b6';
    req.user = {
      _id: loggedInUserId,
    };
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.use('/users', users);
app.use('/cards', cards);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`Сервер подключен — http://${BASE_PATH}:${PORT}`);
});
