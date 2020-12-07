/* eslint-disable no-useless-escape */
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeBookmarksArray, makeMaliciousBookmark } = require('./bookmarks.fixtures');

describe('Article endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  before('clean the table', () => db('bookmarks').truncate());

  after('disconnect from db', () => db.destroy());

  afterEach('cleanup', () => db('bookmarks').truncate());

  describe('GET /api/bookmarks', () => {
    context('Given no bookmarks', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app).get('/api/bookmarks').expect(200, []);
      });
    });

    context('Given there are bookmarks in the database', () => {
      const testBookmarks = makeBookmarksArray();

      beforeEach('insert bookmarks', () => {
        return db.into('bookmarks').insert(testBookmarks);
      });

      it('GET /api/bookmarks responds with 200 and all bookmarks', () => {
        return supertest(app).get('/api/bookmarks').expect(200, testBookmarks);
      });
    });

    context('Given an XSS attack article', () => {
      const maliciousBookmark = makeMaliciousBookmark();
      
      beforeEach('insert malicious article', () => {
        return db
          .into('bookmarks')
          .insert(maliciousBookmark);
      });
      
      it('removes XSS attack desc', () => {
        return supertest(app)
          .get('/api/bookmarks')
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;');
            expect(res.body[0].desc).to.eql('Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.');
          });
      });
    });
  });

  describe('POST /api/bookmarks', () => {
    it('creates an bookmarks, responds with 201 and the new article', function() {
      this.retries(3);
      const newArticle = {
        title: 'juhjuhjuhJennabot',
        rating: 3,
        url: 'http://www.jennabot.com',
        desc: 'dododododolorum tempore deserunt'
      };
      return supertest(app)
        .post('/api/bookmarks')
        .send(newArticle)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).to.eql(newArticle.title);
          expect(res.body.rating).to.eql(newArticle.rating);
          expect(res.body.url).to.eql(newArticle.url);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/bookmarks/${res.body.id}`);
        })
        .then((postRes) =>
          supertest(app)
            .get(`/api/bookmarks/${postRes.body.id}`)
            .expect(postRes.body)
        );
    });

    const fields = ['title', 'rating', 'url', 'desc'];
    fields.forEach(field => {
      const newArticle = {
        title: 'Test new article',
        rating: 'Listicle',
        url: 'http://www.jennajennabot.com',
        desc: 'Test new article desc...'
      };
      it(`responds with 400 and an error message when ${field} field is missing`, () => {
        delete newArticle[field];
        return supertest(app)
          .post('/api/bookmarks')
          .send(newArticle)
          .expect(400, {
            error: {message: `Missing ${field} in request body`}
          });
      });
    });

    context('When an XSS attack article is put in, article is sanitized right away', () => {
      const maliciousBookmark = makeMaliciousBookmark();
      
      it('removes XSS attack content', () => {
        return supertest(app)
          .post('/api/bookmarks')
          .send(maliciousBookmark)
          .expect(201)
          .expect(res => {
            expect(res.body.title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;');
            expect(res.body.desc).to.eql('Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.');
          });
      });
    });
  });

  describe('GET /api/bookmarks/:id', () => {
    context('Given no bookmarks', () => {
      it('responds with 404', () => {
        const testId = 123456;
        return supertest(app)
          .get(`/api/bookmarks/${testId}`)
          .expect(404, { error: { message: 'Bookmark doesn\'t exist' } });
      });
    });

    context('Given there are bookmarks in the database', () => {
      const testBookmarks = makeBookmarksArray();

      beforeEach('insert bookmarks', () => {
        return db.into('bookmarks').insert(testBookmarks);
      });

      it('GET /api/bookmarks/:id responds with 200 and the specified article', () => {
        const testId = 2;
        const expected = testBookmarks[testId - 1];
        return supertest(app)
          .get(`/api/bookmarks/${testId}`)
          .expect(200, expected);
      });
    });

    context('Given an XSS attack article', () => {
      const maliciousBookmark = makeMaliciousBookmark();
      
      beforeEach('insert malicious article', () => {
        return db
          .into('bookmarks')
          .insert([ maliciousBookmark ]);
      });
      
      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/bookmarks/${maliciousBookmark.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;');
            expect(res.body.desc).to.eql('Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.');
          });
      });
    });
  });

  describe('DELETE /api/bookmarks/:article_id', () => {
    context('Given no bookmarks', () => {
      it('responds with 404', () => {
        const articleId = 123456;
        return supertest(app)
          .delete(`/api/bookmarks/${articleId}`)
          .expect(404, { error: { message: 'Bookmark doesn\'t exist' } });
      });
    });

    context('Given there are bookmarks in the database', () => {
      const testBookmarks = makeBookmarksArray();
    
      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks);
      });
    
      it('responds with 204 and removes the article', () => {
        const idToRemove = 2;
        const expectedbookmarks = testBookmarks.filter(article => article.id !== idToRemove);
        return supertest(app)
          .delete(`/api/bookmarks/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get('/api/bookmarks')
              .expect(expectedbookmarks)
          );
      });
    });
  });

  describe('PATCH /api/bookmarks/:articleid', () => {
    context('Given no bookmarks', () => {
      it('responds with 404 if article does not exist', () => {
        const testId = 123456;
        return supertest(app)
          .patch(`/api/bookmarks/${testId}`)
          .send({
            title: 'Test updated bookmark',
            desc: 'Test updated bookmark desc...'
          })
          .expect(404, { 
            error: { 
              message: 'Bookmark doesn\'t exist' 
            } 
          });
      });
    });

    context('Given there are bookmarks in the database', () => {
      const testBookmarks = makeBookmarksArray();

      beforeEach('insert bookmarks', () => {
        return db.into('bookmarks').insert(testBookmarks);
      });

      it('updates an existing bookmark, responds with 201 and the updated bookmark', () => {
        const testId = 2;
        const newData = {
          title: 'Test updated article',
          desc: 'Test updated article desc...'
        };
        return supertest(app)
          .patch(`/api/bookmarks/${testId}`)
          .send(newData)
          .expect(204)
          .then(() =>
            supertest(app)
              .get(`/api/bookmarks/${testId}`)
              .expect((res) => {
                expect(res.body.title).to.eql(newData.title);
                expect(res.body.rating).to.eql(testBookmarks[testId - 1].rating);
                expect(res.body.url).to.eql(testBookmarks[testId - 1].url);
                expect(res.body.desc).to.eql(newData.desc);
                expect(res.body.id).to.eql(testId);
              })
          );
      });

      it('gives a 400 error if no required fields are inputted', () => {
        const articleId = 2;
        const newArticleData = {
          randomField: 'nothin',
        };
        return supertest(app)
          .patch(`/api/bookmarks/${articleId}`)
          .send(newArticleData)
          .expect(400, {
            error: {
              message: 'Please input at least one field for updating' 
            } 
          });
      });
    });
  });
});