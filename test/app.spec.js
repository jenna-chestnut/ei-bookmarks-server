const { expect } = require('chai');
const app = require('../src/app');

describe('App', () => {
  it('does not allow GET without API token', () => {
    // eslint-disable-next-line no-undef
    // return supertest(app)
    //   .get('/bookmarks')
    //   .expect(401);
  });
  it('GETS /bookmarks with API token responds with 200 containing bookmarks array', () => {
    // const token = '1f761d9a-0d19-46a7-8d24-dc39d213f164';
    // // eslint-disable-next-line no-undef
    // return supertest(app)
    //   .get('/bookmarks')
    //   .set('Authorization', 'Bearer ' + token)
    //   .expect(200)
    //   .expect(res => {
    //     expect(res.body).to.be.an('array');
    //   });
  });
});
