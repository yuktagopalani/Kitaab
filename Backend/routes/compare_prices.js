const express = require('express');
const cheerio = require("cheerio");
const axios = require("axios");
const router = express.Router();

import { getFlipkartPrice } from '../scrapping/flipkart';

async function getAmazonPrice(book_name){
    books_data = [];
    const amz_str1="https://www.amazon.in/s?k=";
    const amz_str2="&ref=nb_sb_noss_2";
    book_name = book_name.replace(" ","+");
    const url=amz_str1 + book_name + amz_str2;

    try{
        const response = await axios.get(url, { 
            headers: { "Accept-Encoding": "gzip,deflate,compress" } 
        });

        const $ = cheerio.load(response.data);
        const books=$("div.a-section");
        
        books.each(function(){

        title = $(this).find("span.a-size-medium.a-color-base.a-text-normal").text();
        price = $(this).find("span.a-price-symbol").text() + $(this).find("span.a-price-whole").text();
        description = $(this).find("a.a-size-base.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-bold").text().trim();
        link = $(this).find("a.a-size-base.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-bold").attr("href");
        if(title && price && (description=="Hardcover" || description=="Paperback") && link){
            books_data.push({title, price, description,link});
        }
          

        });

        return books_data;
    }
    catch(error){
        console.error(error);
    }
}

router.post('/compare_prices', (req, res) =>{
    const { book_name } = req.body;

    if(!book_name){
        res.status(418).send({ message: 'Book name is required'})
    }
    (async () => {

        flipkart_data = await getFlipkartPrice(book_name);
        amazon_data = await getAmazonPrice(book_name);
        res.status(200).send({"flipkart_data": flipkart_data, "amazon_data":amazon_data});
    })();
    
})
module.exports = router;