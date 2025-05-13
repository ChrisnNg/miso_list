### Miso List - AI-Powered Task Manager

An intelligent to-do list that auto-organizes tasks using machine learning

**Key Features:**  
- 🧠 AI Categorization: Leverages Google's relevancy algorithm to automatically classify entries 
- 🔗 Smart Recommendations: Generates context-aware quick links for each task 
- 📁 Persistent Storage: PostgreSQL backend maintains categorized tasks across sessions
- ✨ Predictive UI: Suggests task categories as users type 

Tech Stack: `JavaScript` | `Jquery` | `PostgreSQL` | `Node.js` | `Express` | `Google Relevancy API`

## Final Product

!["Landing Page"](https://github.com/SarahMahovlich/miso_list/blob/master/public/images/miso_list_landing.png?raw=true)

## Getting Started

1. Creating the Database
  - Enter Postgres with `psql` and type in the following commands
  - `CREATE ROLE labber WITH LOGIN password 'labber';`
  - `CREATE DATABASE midterm OWNER labber;`
2. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
3. Update the .env file with your correct local information 
  - username: `labber` 
  - password: `labber` 
  - database: `midterm`
4. Install dependencies: `npm i`
5. Fix to binaries for sass: `npm rebuild node-sass`
6. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server after any changes
8. Visit [localhost:8080](http://localhost:8080/)

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- body-parser 1.19.0 
- chalk 2.4.2 
- cookie-parser 1.4.4 
- cookie-session 1.3.3 
- dotenv 2.0.0 
- ejs 2.6.2 
- express 4.17.1 
- jquery 3.4.1 
- morgan 1.9.1 
- node-sass-middleware 0.11.0 
- pg 6.4.2 
- pg-native 3.0.0 

## Authors

The following project is a joint work by @SarahMahovlich, @ChrisnNg, and @anthonyzhu132.

## Acknowledgments

* Lighthouse Labs mentors
* @kvirani For his [Node applications Starter skeleton](https://github.com/lighthouse-labs/node-skeleton)
