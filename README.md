# BOOKMARKS SERVER
---

## Set up

Complete the following steps to set up your server:

1. Clone this repository to your local machine `git clone https://github.com/jenna-chestnut/express-boilerplate.git NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Set the appropriate content for your config.js file for app to run properly:
`export default {
  API_ENDPOINT: `http://localhost:8000/bookmarks`,
  API_KEY: '1f761d9a-0d19-46a7-8d24-dc39d213f164'
}`

---

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

Run a watching test environment `npm run watch`

---

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`.  
This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's main branch.

---

## Included packages:

### For App:

**Morgan** (real-time notifications of requests in the terminal)  
**Cors** (prevents CORS errors with simple requests)  
**Helmet** (protects sensitive header information)  
**Dotenv** (imports from the .env file to process.env object for access)

### For Development:

**NodeMon** (dev server that auto-refreshes when changes are made)  
**Mocha** (a testing structure package)  
**Chai** (assertion functions package)  
**Supertest** (package used to test HTTP calls)
