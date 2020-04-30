require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const MOVIES = require('./movie-data.json')


const app = express();
app.use(morgan('dev'));

console.log(process.env.API_TOKEN)

app.use(function validateBearerToken(req,res,next){
    console.log('validate bearer token middleware')
    const correctKey = process.env.API_TOKEN
    const recievedKey = req.get('Authorization')
    if(correctKey !== recievedKey){
        res.send('my guy, ya done buffed. Yo key is wrong, son!')
    } 
    next()
})
function handleMovies(req,res){
    let response = MOVIES
    debugger
    if(req.query.genre){
        response = response.filter(movie => {
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        })
    }
    if(req.query.country){
        response = response.filter(movie => {
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        })
    }
    if(req.query.avg_vote){
        response = response.filter(movie => {
            movie.avg_vote.includes(req.query.avg_vote)
        })
    }
    res.json(response)
}
app.get('/movies', handleMovies)

const PORT = 8000
app.listen(PORT, () =>{
    console.log(`Server listening at http://localhost:${PORT}`)
})