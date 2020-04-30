require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const MOVIES = require('./movie-data.json')
const cors = require('cors')
const helmet = require('helmet')


const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

console.log(process.env.API_TOKEN)

app.use(function validateBearerToken(req,res,next){
    console.log('validate bearer token middleware')
    const correctKey = process.env.API_TOKEN
    const recievedKey = req.get('Authorization')

    if(!recievedKey || correctKey !== recievedKey.split(' ')[1]){
        res.send('my guy, ya done buffed. Yo key is wrong, son!')
    } 
    next()
})
function handleMovies(req,res){
    let response = MOVIES
    if(req.query.genre){
        response = response.filter(movie => {
            return(
                movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
            )
            
        })
    }
    if(req.query.country){
        response = response.filter(movie => {
            return(
                movie.country.toLowerCase().includes(req.query.country.toLowerCase())
            )  
        })
    }
    if(req.query.avg_vote){
        response = response.filter(movie => {
            return(
              movie.avg_vote >= Number(req.query.avg_vote)
            ) 
        })
    }
    res.send(response)
}
app.get('/movies', handleMovies)

const PORT = 8000
app.listen(PORT, () =>{
    console.log(`Server listening at http://localhost:${PORT}`)
})