const express = require('express');
const router = express.Router();

var genre_info = require('../db/genre_info');
var amazon_bestsellers = require('../constants/amazon_bestsellers');
var book_by_genre = require('../scrapping/book_by_genre');

function bookByGenreRouter(database, app) {
    app.use("/api/v1",
        router.get('/genres/:genre', (req, res) =>{
            var { genre } = req.params;
            genre = genre.replaceAll("+"," ");
            (async () => {
                genre_detail = await genre_info.getGenreInfo(genre, database);
                genre_url = genre_detail[0]['website link'];
                books = await book_by_genre.getBookByGenre(amazon_bestsellers,genre_url);
                res.status(200).send(books);
            })();
            
        })
    );
}

exports.bookByGenreRouter = bookByGenreRouter;