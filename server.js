// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const connectionString = 'postgres://doydrcacqiihwp:31234f1b38929cf39fa706cd3e3f84407aa714893be307ef3701a2eeac5cf975@ec2-54-204-39-43.compute-1.amazonaws.com:5432/d1schf4qtqc0ti';
const db = new Pool({connectionString});
db.connect();
const { searchEngine } = require('./lib/searchEngine');
const resultQueries = require('./routes/resultQueries.js');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use((req, res, next) => {
  if (req.cookies.user_id) {
    resultQueries.getUser(req.cookies.user_id)
      .then((user) => {
        req.user = user;
        res.locals.user = user;
        next();
      })
      .catch((err) => {
        res.clearCookie('user_id');
        next();
      });
  } else {
    next();
  }
});

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

//RENDERING ROOT PAGE
app.get("/", (req, res) => {
  if (req.user) {
    resultQueries.getAllThings(req.user.id)
      .then((result) => {
        const templatevars = {results: result};
        resultQueries.getArchivedThings(req.user.id)
          .then((archive) => {
            templatevars.archives = archive;
            res.render("index", templatevars);
          });
      }).catch((err) => {
        console.log(err)
      });
  } else {
    res.redirect("/login");
  }
});

//POSTING INFORMATION FROM FORM
app.post("/", (req, res) => {
  const string = req.body.searchEngine;
  // const templatevars = {results: searchEngine(string)};
  //find the category using a helper function googlesearch API
  searchEngine(string, req.user.id, (success) => {
    if (success) {
      resultQueries.getAllThings(req.user.id)
        .then((result) => {
          res.redirect('/');
        });
    }
  });
});

//RENDERING REGISTRATION PAGE
app.get("/register", (req, res) => {
  res.render("register");
});

//POSTING INFORMATION FROM REGISTRATION PAGE // REGISTERING NEW USER
app.post("/register", (req, res) => {
  let newUsername = req.body.username;
  let newEmail = req.body.email.strip();
  let newPassword = req.body.password;
  resultQueries.newUserDB(newUsername, newEmail, newPassword)
    .then((user) => {
      res.cookie("user_id", user.id);
      res.redirect("/");
    });
});

//RENDERING LOGIN PAGE
app.get("/login", (req, res) => {
  res.render("login");
});

//LOGGING INTO THE USER ACCOUNT
app.post("/login", (req, res) => {
  const email = req.body.email.strip();
  if (email) {
    resultQueries.checkEmail(email)
      .then((result) => {
        if (email === result.email) {
          console.log(result);
          res.cookie("user_id", result.id);
          res.redirect('/');
        } else {
          res.send("FAIL");
          console.log("Failed to login");
        }
      }).catch((err) => {
        console.log(err)
      });
  } else {
    res.status(404);
  }
});

// logging out and deleting cookies from session
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

//MARKING THE ITEM AS COMPLETED
app.post("/:table/:id/complete", (req, res) => {
  const itemTable = res.req.params.table;
  const itemId = res.req.params.id;
  const status = req.route.methods.post;
  if (status === true) {
    resultQueries.markCompleteItem(itemTable, itemId)
      .then((result) => {
        res.redirect('/');
      });
  }
});

app.post("/:table/:id/unarchive", (req, res) => {
  const itemTable = res.req.params.table;
  const itemId = res.req.params.id;
  const status = req.route.methods.post;
  if (status === true) {
    resultQueries.markUnCompleteItem(itemTable, itemId)
      .then((result) => {
        res.redirect('/');
      });
  }
});

//RENDERING SELECTED ITEM PAGE
app.get("/:table/:id", (req, res) => {
  const itemId = res.req.params.id;
  const status = req.route.methods.get;
  if (status === true) {
    resultQueries.getAllThings(req.user.id)
      .then((result) => {
        let itemTable = 'null';

        if (req.url.includes('books')) {
          itemTable = 'books';
        }
        if (req.url.includes('movies')) {
          itemTable = 'movies_and_series';
        }
        if (req.url.includes('products')) {
          itemTable = 'products';
        }
        if (req.url.includes('misc')) {
          itemTable = 'misc';
        }
        if (req.url.includes('restaurants')) {
          itemTable = 'restaurants';
        }
        const table = result[itemTable];
        let arrayIndex = 0;
        for (let i = 0; i < table.length; i++) {
          if (table[i]['id'] == itemId) {
            arrayIndex = i;
            break;
          }
        }
        const templateVars = {itemId, name: table[arrayIndex]['name'], context: table[arrayIndex]['context'], id: table[arrayIndex]['id']};
        res.render("showItem", templateVars);
      });
  }

});

//EDITING THE NAME
app.post("/:table/:id", (req, res) => {
  let listItem = req.headers.referer;
  listItem = listItem.replace(`http://localhost:${PORT}/`, '');
  listItem = listItem.replace('books/', '');
  listItem = listItem.replace('movies/', '');
  listItem = listItem.replace('products/', '');
  listItem = listItem.replace('misc/', '');
  listItem = listItem.replace('restaurants/', '');
  listItem = decodeURI(listItem);

  const string = req.body.nameEdit;

  if (req.headers.referer.includes('books')) {
    resultQueries.editBooks(string, listItem, req.user.id);
  }
  if (req.headers.referer.includes('movies')) {
    resultQueries.editMovies(string, listItem, req.user.id);
  }
  if (req.headers.referer.includes('products')) {
    resultQueries.editProducts(string, listItem, req.user.id);
  }
  if (req.headers.referer.includes('misc')) {
    resultQueries.editMisc(string, listItem, req.user.id);
  }
  if (req.headers.referer.includes('restaurants')) {
    resultQueries.editRestaurants(string, listItem, req.user.id);
  }
  res.redirect('/');
});

//DELETING THE URL
app.post("/:table/:id/delete", (req, res) => {
  let listItem = req.headers.referer;
  listItem = listItem.replace(`http://localhost:${PORT}/`, '');
  listItem = listItem.replace('/delete', '');
  listItem = listItem.replace('books/', '');
  listItem = listItem.replace('movies/', '');
  listItem = listItem.replace('products/', '');
  listItem = listItem.replace('misc/', '');
  listItem = listItem.replace('restaurants/', '');
  listItem = decodeURI(listItem);// listitem is the id

  if (req.headers.referer.includes('books')) {
    resultQueries.deleteBooks(listItem);
  }
  if (req.headers.referer.includes('movies')) {
    resultQueries.deleteMovies(listItem);
  }
  if (req.headers.referer.includes('products')) {
    resultQueries.deleteProducts(listItem);
  }
  if (req.headers.referer.includes('misc')) {
    resultQueries.deleteMisc(listItem);
  }
  if (req.headers.referer.includes('restaurants')) {
    resultQueries.deleteRestaurants(listItem);
  }

  res.redirect('/');
});

// UPDATING THE CATEGORY IMPLEMENTING
app.post("/:table/:id/:name/update", (req, res) => {
  //extracts name from the url
  let name = req.url;
  name = name.replace(`http://localhost:${PORT}/`, '');
  name = name.replace('/update', '');
  name = name.replace(':table/', '');
  name = name.split('/');
  name = name[2];
  name = decodeURI(name);
  //extracts item id from the url

  let listItem = req.headers.referer;
  listItem = listItem.replace(`http://localhost:${PORT}/`, '');
  listItem = listItem.replace('/update', '');
  listItem = listItem.replace('books/', '');
  listItem = listItem.replace('movies/', '');
  listItem = listItem.replace('products/', '');
  listItem = listItem.replace('misc/', '');
  listItem = listItem.replace('restaurants/', '');
  listItem = decodeURI(listItem);
  if (req.body.Category) {
    resultQueries.deleteBooks(listItem);
    resultQueries.deleteProducts(listItem);
    resultQueries.deleteMovies(listItem);
    resultQueries.deleteRestaurants(listItem);
    resultQueries.deleteMisc(listItem);
  }

  //extract name
  if (req.body.Category === 'Books') {
    resultQueries.recatergorizeIntoBooks(name, req.body.contextEdit, req.user.id);
  }
  if (req.body.Category === 'Products') {
    resultQueries.recatergorizeIntoProducts(name, req.body.contextEdit, req.user.id);
  }
  if (req.body.Category === 'Movies & TV series') {
    resultQueries.recatergorizeIntoMovies(name, req.body.contextEdit, req.user.id);
  }
  if (req.body.Category === 'Restaurants') {
    resultQueries.recatergorizeIntoRestaurants(name, req.body.contextEdit, req.user.id);
  }
  if (req.body.Category === 'Misc') {
    resultQueries.recatergorizeIntoMisc(name, req.body.contextEdit, req.user.id);
  }
  //delete old entry in the db
  if (req.headers.referer.includes('books')) {
    resultQueries.deleteBooks(listItem);
  }
  if (req.headers.referer.includes('movies')) {
    resultQueries.deleteMovies(listItem);
  }
  if (req.headers.referer.includes('products')) {
    resultQueries.deleteProducts(listItem);
  }
  if (req.headers.referer.includes('misc')) {
    resultQueries.deleteMisc(listItem);
  }
  if (req.headers.referer.includes('restaurants')) {
    resultQueries.deleteRestaurants(listItem);
  }

  res.redirect('/');

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
