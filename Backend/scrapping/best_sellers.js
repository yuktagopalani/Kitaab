const cheerio = require("cheerio");
const axios = require("axios");

var bookSchema = require('../models/book');
var amazon_bestsellers = require('../constants/amazon_bestsellers');

async function getBestSellers(){
    books_data = [];
    const url = amazon_bestsellers.url;
    try{
        const response = await axios.get(url, { 
            headers: { "Accept-Encoding": "gzip,deflate,compress" } 
        });

        const $ = cheerio.load(response.data);
        var book = new bookSchema.Book(amazon_bestsellers.books,amazon_bestsellers.title,amazon_bestsellers.description,amazon_bestsellers.link,amazon_bestsellers.image);
        const books=$(book.books);
        
        books.each(function(){
            title = $(this).find(book.title).text();
            price = $(this).find(book.price).text();
            description = $(this).find(book.description).text();
            link = $(this).find(book.link).attr("href");
            image = $(this).find(book.image).attr("src");
            books_data.push({title, price, description,link,image});  
        });

        return books_data;
    }
    catch(error){
        console.error(error);
    }
}

exports.getBestSellers = getBestSellers;