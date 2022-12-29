const cheerio = require("cheerio");
const axios = require("axios");

var bookSchema = require('../models/book');

async function getBookByGenre(amazon_bestsellers, url){
    books_data = [];
    try{
        const response = await axios.get(url, { 
            headers: { "Accept-Encoding": "gzip,deflate,compress" } 
        });

        const $ = cheerio.load(response.data);
        const books=$(amazon_bestsellers.books);
        
        books.each(function(){
            title = $(this).find(amazon_bestsellers.title).text();
            price = $(this).find(amazon_bestsellers.price).text();
            description = $(this).find(amazon_bestsellers.description).text();
            link = "https://www.amazon.in" + $(this).find(amazon_bestsellers.link).attr("href");
            image = $(this).find(amazon_bestsellers.image).attr("src");

            var book = new bookSchema.Book(title,price,description,link,image);
            books_data.push(book);  
        });

        return books_data;
    }
    catch(error){
        console.error(error);
    }
}

exports.getBookByGenre = getBookByGenre;