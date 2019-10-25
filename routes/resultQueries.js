const { searchEngine } = require('../lib/searchEngine');

const { Pool } = require('pg');
const connectionString = 'postgres://doydrcacqiihwp:31234f1b38929cf39fa706cd3e3f84407aa714893be307ef3701a2eeac5cf975@ec2-54-204-39-43.compute-1.amazonaws.com:5432/d1schf4qtqc0ti';
const pool = new Pool({connectionString});

// look at how to chain promises!
const getAllThings = (id) => {
  let returnObj = {};
  let queryString = `
  SELECT *
  FROM products
  WHERE is_active = true AND user_id = $1;
  `;
  return pool.query(queryString, [id])
    .then((data) => {
      returnObj['products'] = data.rows;
      let queryString = `
      SELECT *
      FROM books
      WHERE is_active = true AND user_id = $1;
      `;
      return pool.query(queryString, [id])
        .then((data) => {
          returnObj['books'] = data.rows;
          let queryString = `
          SELECT *
          FROM movies_and_series
          WHERE is_active = true AND user_id = $1;
          `;
          return pool.query(queryString, [id])
            .then((data) => {
              returnObj['movies_and_series'] = data.rows;
              let queryString = `
              SELECT *
              FROM restaurants
              WHERE is_active = true AND user_id = $1;
              `;
              return pool.query(queryString, [id])
                .then((data) => {
                  returnObj['restaurants'] = data.rows;
                  let queryString = `
                  SELECT *
                  FROM misc
                  WHERE is_active = true AND user_id = $1;
                  `;
                  return pool.query(queryString, [id])
                    .then((data) => {
                      returnObj['misc'] = data.rows;
                      return returnObj;
                    });
                });
            });
        });
    });
};

const getArchivedThings = (id) => {
  let returnObj = {};
  let queryString = `
  SELECT *
  FROM products
  WHERE is_active = false AND user_id = $1;
  `;
  return pool.query(queryString, [id])
    .then((data) => {
      returnObj['products'] = data.rows;
      let queryString = `
      SELECT *
      FROM books
      WHERE is_active = false AND user_id = $1;
      `;
      return pool.query(queryString, [id])
        .then((data) => {
          returnObj['books'] = data.rows;
          let queryString = `
          SELECT *
          FROM movies_and_series
          WHERE is_active = false AND user_id = $1;
          `;
          return pool.query(queryString, [id])
            .then((data) => {
              returnObj['movies_and_series'] = data.rows;
              let queryString = `
              SELECT *
              FROM restaurants
              WHERE is_active = false AND user_id = $1;
              `;
              return pool.query(queryString, [id])
                .then((data) => {
                  returnObj['restaurants'] = data.rows;
                  let queryString = `
                  SELECT *
                  FROM misc
                  WHERE is_active = false AND user_id = $1;
                  `;
                  return pool.query(queryString, [id])
                    .then((data) => {
                      returnObj['misc'] = data.rows;
                      return returnObj;
                    });
                });
            });
        });
    });
};

const addToWatch = (body, snippet, link, query, id) => {
  if (body.spelling) {
    query = body.spelling.correctedQuery;
  }
  return pool.query(`
  INSERT INTO movies_and_series (name, context, link, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `, [query, snippet, link, id])
    .then(res => res.rows[0]);
};

const addToRead = (body, snippet, link, query, id) => {
  if (body.spelling) {
    query = body.spelling.correctedQuery;
  }
  return pool.query(`
  INSERT INTO books (name, context, link, user_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `, [query, snippet, link, id])
    .then(res => res.rows[0]);
};

const addToEat = (body, snippet, link, query, id) => {
  if (body.spelling) {
    query = body.spelling.correctedQuery;
  }
  return pool.query(`
  INSERT INTO restaurants (name, context, link, user_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `, [query, snippet, link, id])
    .then(res => res.rows[0]);
};

const addToBuy = (body, snippet, link, query, id) => {
  if (body.spelling) {
    query = body.spelling.correctedQuery;
  }
  return pool.query(`
  INSERT INTO products (name, context, link, user_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `, [query, snippet, link, id])
    .then(res => res.rows[0]);
};

const addToMisc = (query, id) => {
  return pool.query(`
  INSERT INTO misc (name, context, user_id)
  VALUES ($1, $2, $3)
  RETURNING *;
  `, [query, '', id])
    .then(res => res.rows[0]);
};

const editBooks = (formInput, listItem, id) => {
  return pool.query(`
  UPDATE books
  SET name = $1
  WHERE id = $2 AND is_active = true AND user_id = $3;
  `, [formInput, listItem, id])
    .then(res => res.rows[0]);
};

const editProducts = (formInput, listItem, id) => {
  return pool.query(`
  UPDATE products
  SET name = $1
  WHERE id = $2 AND is_active = true AND user_id = $3;
  `, [formInput, listItem, id])
    .then(res => res.rows[0]);
};

const editMovies = (formInput, listItem, id) => {
  return pool.query(`
  UPDATE movies_and_series
  SET name = $1
  WHERE id = $2 AND is_active = true AND user_id = $3;
  `, [formInput, listItem, id])
    .then(res => res.rows[0]);
};

const editRestaurants = (formInput, listItem, id) => {
  return pool.query(`
  UPDATE restaurants
  SET name = $1
  WHERE id = $2 AND is_active = true AND user_id = $3;
  `, [formInput, listItem, id])
    .then(res => res.rows[0]);
};

const editMisc = (formInput, listItem, id) => {
  return pool.query(`
  UPDATE misc
  SET name = $1
  WHERE id = $2 AND is_active = true AND user_id = $3;
  `, [formInput, listItem, id])
    .then(res => res.rows[0]);
};

const deleteBooks = (listItem) => {
  return pool.query(`
  DELETE
  FROM books
  WHERE id = $1 AND is_active = true;
  `, [listItem])
    .then(res => res.rows[0]);
};

const deleteProducts = (listItem) => {
  return pool.query(`
  DELETE
  FROM products
  WHERE id = $1 AND is_active = true;
  `, [listItem])
    .then(res => res.rows[0]);
};

const deleteMovies = (listItem) => {
  return pool.query(`
  DELETE
  FROM movies_and_series
  WHERE id = $1 AND is_active = true;
  `, [listItem])
    .then(res => res.rows[0]);
};

const deleteRestaurants = (listItem) => {
  return pool.query(`
  DELETE
  FROM restaurants
  WHERE id = $1 AND is_active = true;
  `, [listItem])
    .then(res => res.rows[0]);
};

const deleteMisc = (listItem) => {
  return pool.query(`
  DELETE
  FROM misc
  WHERE id = $1 AND is_active = true;
  `, [listItem])
    .then(res => res.rows[0]);
};

//Archive and Unarchive
const markCompleteItem = (table, id) => {
  return pool.query(`
  UPDATE ${table}
  SET is_active = false
  WHERE id = $1;
  `, [id])
    .then(res => res.rows[0]);
};

const markUnCompleteItem = (table, id) => {
  return pool.query(`
  UPDATE ${table}
  SET is_active = true
  WHERE id = $1;
  `, [id])
    .then(res => res.rows[0]);
};

const recatergorizeIntoMovies = (name, context, id) => {
  return pool.query(`
  INSERT INTO movies_and_series (name, context, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [name, context, id])
    .then(res => res.rows[0]);
};

const recatergorizeIntoBooks = (name, context, id) => {
  return pool.query(`
  INSERT INTO books (name, context, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [name, context, id])
    .then(res => res.rows[0]);
};

const recatergorizeIntoProducts = (name, context, id) => {
  return pool.query(`
  INSERT INTO products (name, context, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [name, context, id])
    .then(res => res.rows[0]);
};

const recatergorizeIntoRestaurants = (name, context, id) => {
  return pool.query(`
  INSERT INTO restaurants (name, context, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [name, context, id])
    .then(res => res.rows[0]);
};

const recatergorizeIntoMisc = (name, context, id) => {
  return pool.query(`
  INSERT INTO misc (name, context, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [name, context, id])
    .then(res => res.rows[0]);
};

//User queries
const newUserDB = (username, email, password) => {
  email = email.trim()
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `, [username, email, password])
    .then(res => res.rows[0]);
};

const checkEmail = (email) => {
  return pool.query(`
  SELECT * FROM users
  WHERE email = $1;
  `, [email])
    .then(res => res.rows[0]);
};

const getUser = (id) => {
  let queryString = `
  SELECT *
  FROM users
  WHERE id = $1;
  `;
  return pool.query(queryString, [id])
    .then(res => res.rows[0]);
};

module.exports = {
  getAllThings,
  getArchivedThings,
  addToWatch,
  addToRead,
  addToEat,
  addToBuy,
  addToMisc,
  editBooks,
  editProducts,
  editMovies,
  editRestaurants,
  editMisc,
  deleteBooks,
  deleteProducts,
  deleteMovies,
  deleteRestaurants,
  deleteMisc,
  recatergorizeIntoMovies,
  recatergorizeIntoBooks,
  recatergorizeIntoProducts,
  recatergorizeIntoMisc,
  recatergorizeIntoRestaurants,
  markCompleteItem,
  newUserDB,
  checkEmail,
  markUnCompleteItem,
  getUser
};
