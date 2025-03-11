import express from 'express'
import {RenderingProfile } from '../controllers/user.js'
import { getUser } from '../service/auth.js'
import {  restrictTo ,restrictToLoggedInUserOnly } from '../middlewares/auth.js'
import { RandomQuoteGenerator } from 'quote-guru'
const router = express.Router();

router.get('/signup',(req,res)=>{
    return res.render("signup");
})
router.get('/login',(req,res)=>{
    return res.render("login")
})

router.get('/profile', RenderingProfile )



router.get('/',restrictToLoggedInUserOnly,(req,res)=>{
    const sessionid = req.cookies?.token;
    if(!sessionid) return res.render('signup');
    const user = getUser(sessionid);  // Session ID se user fetch karo

    if (!user) {
        return res.redirect("/login"); // Agar user nahi mila to login page pe redirect kar do
    }

   return  res.render("index", { randomQuote: res.locals.randomQuote, user });
   
})

router.get("/api/quote", restrictToLoggedInUserOnly, async(req, res) => {
    const quoteGenerator = new RandomQuoteGenerator();
      const randomQuote = await quoteGenerator.getRandomQuote(); // Random quote fetch karo
    res.json(randomQuote); // JSON response send kar do
});

export default router;
