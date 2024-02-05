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
    
    app.route('/articles')
        .get(async (req, res) => {
            try {
                const allArticles = await Article.find()
                res.send(allArticles)
            } catch (error) {
                res.send(error.message)
            }
        })
        .post((req, res) => {
            const article = new Article({
                title: req.body.title,
                content: req.body.content
            })
            try {
                article.save()
            } catch (error) {
                res.send(error.message)
            }
        })
        .delete(async (req, res) => {
            try {
                await Article.deleteMany()
                res.send('All articles deleted')
            } catch (error) {
                res.send(error.message)
            }
        })

        app.route('/articles/:articleTitle')
        .get(async (req, res) => {
            try {
                const article = await Article.findOne({title: req.params.articleTitle})
                if (article) {
                    res.send(article)
                } else {
                    res.send('No article found')
                }
            } catch (error) {
                res.send(error.message)
            }
        })
        .put(async (req, res) => {
            try {
                await Article.updateOne(
                    {title: req.params.articleTitle},
                    {title: req.body.title, content: req.body.content},
                    {overwrite: true}
                )
                res.send('Article updated')
            } catch (error) {
                console.log(error.message);
            }
        })
        .patch(async (req, res) => {
            try {
                await Article.updateOne(
                    {title: req.params.articleTitle},
                    {$set: req.body}
                )
                res.send('Article updated')
            } catch (error) {
                console.log(error.message);
            }
        })
        .delete(async (req, res) => {
            try {
                await Article.deleteOne({title: req.params.articleTitle})
                res.send('Article deleted')
            } catch (error) {
                res.send(error.message)
            }
        })
}

app.listen(2000, () => {
    console.log('sever running on http://localhost:2000');
})
main()