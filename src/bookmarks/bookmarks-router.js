const express = require('express');
const BookmarkService = require('./bookmarks-service');
const xss = require('xss');
const path = require('path');

const bookmarksRouter = express.Router();

bookmarksRouter
  .route('/')
  .get((req, res, next) => {
    
    BookmarkService.getAllBookmarks(req.app.get('db'))
      .then((bookmarks) => {
        if (bookmarks.length !== 0) {
          bookmarks = bookmarks.map(bookmark => {
            return {
              id: bookmark.id,
              title: xss(bookmark.title), // sanitize title
              rating: bookmark.rating,
              url: xss(bookmark.url),
              desc: xss(bookmark.desc), // sanitize desc
              expanded: bookmark.expanded,
            };  
          });
        }
        return bookmarks;
      })
      .then(bookmarks => res.json(bookmarks))
      .catch(next);
  })
  .post((req, res, next) => {
    const { title, rating, url, desc } = req.body;
    let newbookmark = { 
      title, rating, url, desc
    };

    for (const [key, value] of Object.entries(newbookmark)) {
      // eslint-disable-next-line eqeqeq
      if(value == null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` }
        });
      }
    }

    newbookmark = { 
      title: xss(title),
      rating,
      url: xss(url),
      desc: xss(desc),
    };

    if (rating > 5 || rating < 1) {
      return res.status(400).json({
        error: { message:  'Rating must be between 1 and 5'}
      });
    }

    BookmarkService.insertBookmark(
      req.app.get('db'),
      newbookmark
    )
      .then(bookmark => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${bookmark.id}`))
          .json(bookmark);
      })
      .catch(next);
  });

bookmarksRouter
  .route('/:bookmark_id')
  .all((req, res, next) => {
    BookmarkService.getById(
      req.app.get('db'),
      req.params.bookmark_id
    )
      .then(bookmark => {
        if (!bookmark) {
          return res.status(404).json({
            error: { message: 'Bookmark doesn\'t exist' }
          });
        }
        res.bookmark = bookmark;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    const { bookmark } = res;
    res.json({
      id: bookmark.id,
      title: xss(bookmark.title), // sanitize title
      rating: bookmark.rating,
      url: bookmark.url,
      desc: xss(bookmark.desc), // sanitize desc
      expanded: bookmark.expanded
    });
  })
  .patch((req, res, next) => {
    const { title, desc, rating, url } = req.body;

    if (!title && !desc && !rating && !url) {
      return res.status(400)
        .json({ 
          error: { 
            message: 'Please input at least one field for updating' 
          } 
        });
    }

    if (rating && rating > 5 || rating < 1) {
      return res.status(400).json({
        error: { message:  'Rating must be between 1 and 5'}
      });
    }

    const newbookmarkData = {
      title: xss(title) || undefined,
      rating: rating || undefined,
      url: xss(url) || undefined,
      desc: xss(desc) || undefined,
    };

    BookmarkService.updateBookmark(
      req.app.get('db'),
      req.params.bookmark_id,
      newbookmarkData
    ).then(() => {
      res.status(204)
        .end();
    })
      .catch(next);
  })
  .delete((req, res, next) => {
    BookmarkService.deleteBookmark(
      req.app.get('db'),
      req.params.bookmark_id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = bookmarksRouter;
