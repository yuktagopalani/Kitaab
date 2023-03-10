const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
var compare_prices = require('./routes/compare_prices');
var best_sellers = require('./routes/best_sellers');
var genres = require('./routes/genres');
var book_by_genre = require('./routes/book_by_genre');
// var connection = require('./db/connection');



// (async () => {
//   const database = await connection.getConnection();
//   genres.genereRouter(database, app);
//   book_by_genre.bookByGenreRouter(database, app);
// })();



// ---- middlewares------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//--- Add headers in order to perform all operation on API
// ---Because CORS Thing
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Header", "*");
    next();
  });



// -----routes-------
app.use("/api/v1", compare_prices.router);
app.use("/api/v1", best_sellers.router);
app.use("/api/v1/genres/:genre", async function(req, res) {
    try{
      books = await book_by_genre.getBookUtil(req, res);
      res.status(200).send(books);
    }
    catch(e){
      res.status(404).send(e);
    }

})
genres.genereRouter("", app);


// ------------health check-----
app.get('/api/v1', (req, res) =>{
      res.sendStatus(200);
});


// -----listen to port------
app.listen(
    port,
    () => console.log(`its alive on ${port}`)
);
