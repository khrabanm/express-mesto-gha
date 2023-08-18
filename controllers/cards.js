const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  // eslint-disable-next-line no-undef
  Card.find()
    .then((cardList) => res.send({ data: cardList }))
    .catch(next);
};

// eslint-disable-next-line consistent-return
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const owner = req.user._id;

  // eslint-disable-next-line no-underscore-dangle
  Card.create({ name, link, owner })
    .then((cardObject) => res.status(201).send({ data: cardObject }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные в метод создания карточки',
        });
      }
      return res.status(500).json({ message: 'Не удалось создать карточку', err });
    });
};

module.exports.removeCard = (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  Card.findByIdAndRemove(req.params.cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        return res.status(404).send({ message: 'Карточка не найдена', card });
      }
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.message === 'CastError') {
        res.status(500).send({ message: 'Что-то пошло не так', err });
      } else {
        return res.status(400).send({ message: 'Некорректный id карточки', err });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // eslint-disable-next-line no-underscore-dangle
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((likedCard) => {
    if (!likedCard) {
      return res.status(404).send({
        message: 'Запрашиваемая карточка для добавления лайка не найдена',
      });
    }
    return res.status(201).send(likedCard);
  }).catch((err) => {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Некорректный id карточки', err });
    }
    return res.status(500).send({ message: 'Что-то пошло не так', err });
  });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // eslint-disable-next-line no-underscore-dangle
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((dislikedCard) => {
      if (dislikedCard) {
        res.send({ data: dislikedCard });
      } else {
        return res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
      }
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.message === 'CastError') {
        res.status(500).send({ message: 'Что-то пошло не так', err });
      } else {
        return res.status(400).send({ message: 'Некорректный id карточки', err });
      }
    });
};
