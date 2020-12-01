# BOOKMARKS SERVER
---

### Bookmarks server created for use with client side app here:
https://github.com/Thinkful-Ed/bookmarks-app

## Set up

Complete the following steps to set up your server:

1. Clone this repository to your local machine `git clone https://github.com/jenna-chestnut/ei-bookmarks-server.git`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Set the appropriate content for your config.js file for app to run properly:
`export default {
  API_ENDPOINT: 'http://localhost:8000/bookmarks',
  API_KEY: '1f761d9a-0d19-46a7-8d24-dc39d213f164'
}`

## Scripts 

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

Run a watching test environment `npm run watch`
