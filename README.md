# Miso_list

When you are recommended something it's not always easy to jot it down for later in an organized fashion. Adding the item to your phone or computer ends up taking time and opening up the right app is only part of the problem. You then have to locate the right list ("Movies to watch", "Books to read", etc.) to add to. And if you do get it in to the right list, you don't have much more context about it. This delay and lack of additional information acts as a huge deterrent.

The solution? Miso_list- A smart todo list app that persists user data using Express/Postgres.
          It will automatically categorize each todo list item into a category
          (movies, books, products, restaurants) by using our categorization
          logic built with Google's relevancy algorithm.

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
