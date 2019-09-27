const request = require('request');
const { addToWatch, addToBuy, addToRead, addToEat, addToMisc } = require('../routes/resultQueries');
// const { Pool } = require('pg');
// const dbParams = require('../lib/db.js');
// const db = new Pool(dbParams);

const searchEngine = function(query, id, cb) {
  request(`https://www.googleapis.com/customsearch/v1?key=AIzaSyBzO6xal-XoFGuj0u7p0ziAaIDPHlZlgPU&cx=002704402873488483019:4ujf79s3i2h&q=${query}`, (error, response, body) => {
    body = JSON.parse(body);
    if (body.items) {
      console.log(body.items.length)
      for (let i = 0; i < body.items.length; i++) {
        if (body.items[i]['link'].includes("imdb")) {
          addToWatch(body, body.items[i]['snippet'], body.items[i]['link'], query, id);
          return cb(true);
        }
        if (body.items[i]['link'].includes("goodreads") && !body.items[0]['link'].includes("topic") && !body.items[0]['link'].includes("quotes")) {
          addToRead(body, body.items[i]['snippet'], body.items[i]['link'], query, id);
          return cb(true);
        }

        if (body.items[i]['link'].includes("zomato") && body.items[0]['displayLink'].includes("zomato")) {
          addToEat(body, body.items[i]['snippet'], body.items[i]['link'], query, id);
          return cb(true);
        }

        if (body.items[i]['link'].includes("amazon")) {
          addToBuy(body, body.items[i]['snippet'], body.items[i]['link'], query, id);
          return cb(true);
        }

      }
    } else {
      addToMisc(query, id);
      cb(true);
    }

  });
  return searchEngine;
};


module.exports = { searchEngine };

