import express from 'express';
import path from 'path'
import cookieParser  from 'cookie-parser';
import { RandomQuoteGenerator } from 'quote-guru'
const app = express();
const PORT = 1700;


//importing connection  and setting connection
 import { ConnectToMongoDB } from './connect.js'
 ConnectToMongoDB('mongodb://127.0.0.1:27017/QuoteUser')
 .then(()=> console.log("mongodb"))
 .catch((err)=> console.log(err))


//importing router

import Staticrouters from './routes/staticRouter.js';
import UserRouters from './routes/user.js'
import LogoutRouter from './routes/logout.js'

//importing middlewares
import { restrictToLoggedInUserOnly } from './middlewares/auth.js'


// setting middle wares
app.use(express.json())
app.use(express.urlencoded({extended:true}));//middle ware to pass form data
app.use(cookieParser());
app.use(async (req, res, next) => {
  const quoteGenerator = new RandomQuoteGenerator();
  res.locals.randomQuote = await quoteGenerator.getRandomQuote(); //  `res.locals` me store kar diya
  next();
});



//setting view engines
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'))

 
//setiing routes
app.use('/', Staticrouters);
app.use('/user', UserRouters)
app.use('/logout', LogoutRouter)

//Listening the port 
app.listen(PORT,()=>console.log("server started at http://localhost:1700"))