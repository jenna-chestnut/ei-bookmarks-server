const express = require('express');
const { v4: uuid } = require('uuid');
const logger = require('../logger.js');
const bookmarks = require('../store.js');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

function isValidUrl(string) {
  try {
    new URL(string);
  } catch (_) {
    return false;
  }

  return true;
}

bookmarksRouter
  .route('/')
  .get((req, res) => {
    res
      .json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, rating = 1, url, desc = '' } = req.body;

    if (!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!url) {
      logger.error('Url is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!isValidUrl(url)) {
      logger.error(`${url} is not a valid url`);
      return res
        .status(400)
        .send('Invalid data');
    }

    const id = uuid();

    const bookmark = {
      id,
      title,
      rating,
      url,
      desc,
      expanded: false
    };

    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmark);
  });

bookmarksRouter
  .route('/:id')
  .delete((req, res) => {
    const { id } = req.params;

    const index = bookmarks.findIndex(c => c.id === id);

    if (index === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not found');
    }

    bookmarks.splice(index, 1);

    logger.info(`bookmark with id ${id} deleted.`);

    res
      .status(204)
      .end();
  })
  .patch((req, res) => {
    const { title, rating = 1, url, desc = '' } = req.body;
    const { id } = req.params;

    const index = bookmarks.findIndex(c => c.id === id);

    if (index === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not found');
    }

    if (!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!url) {
      logger.error('Url is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!isValidUrl(url)) {
      logger.error(`${url} is not a valid url`);
      return res
        .status(400)
        .send('Invalid data');
    }

    const bookmark = {
      id,
      title,
      rating,
      url,
      desc,
      expanded: false
    };

    bookmarks.splice(index, 1, bookmark);

    logger.info(`Bookmark with id ${id} updated`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmark);
  });

module.exports = bookmarksRouter;