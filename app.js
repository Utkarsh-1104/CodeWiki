require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const URI = process.env.MONGODB_URI

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function main() {

    mongoose.connect(URI)
    
    const articleSchema = {
        title: String,
        content: String
    }
    
    const Article = mongoose.model("Article", articleSchema)

    app.get('/', (req, res) => { 
        res.send('<h1>Hello World</h1>')
    })
    
    app.get('/articles', async (req, res) => {
        const allArticles = await Article.find()
        console.log(allArticles);
    })
   
}
app.listen(2000, () => {
    console.log('sever running on http://localhost:2000');
})
main()