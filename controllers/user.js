import User from '../models/users.js';
import { v4  as uuidv4 } from 'uuid'
import { setUser, getUser } from '../service/auth.js'
async function HandleUserSignup(req,res){
  
    const { name, email , password} = req.body;
     const person  =  await User.create({
        name,
        email,
        password,
    });

    const token = setUser(person);
   // setUser(person);
    res.cookie('token',token,{
        httpOnly: true,  
        maxAge: 360 * 24 * 60 * 60 * 1000
    })
  
   return res.render("index",{randomQuote: res.locals.randomQuote});
   //return res.json({token})
}

async function HandleUserLogin(req,res){
    const {email,password} = req.body;
    const user = await User.findOne({email,password});
    if(!user){
        return res.render("login", {
            error:"either email or password is wrong"
        })
    }
    
     const token = setUser(user);
    res.cookie('token',token,{
    //    domain: "www.google.com",
    //domain : ".piyushgarg.dev"   
        httpOnly: true,  
        maxAge: 360 * 24 * 60 * 60 * 1000
    })
    return res.render("index",{randomQuote: res.locals.randomQuote, user });   
 // return res.json({token})
}

async function RenderingProfile(req,res){
    const sessionId = req.cookies?.token;
    if (!sessionId) {
        return res.redirect("/login"); // Agar session nahi hai to login pe bhejo
    }

    const user = getUser(sessionId);
    if (!user) {
        console.error("Invalid token or user not found.");
        return res.redirect("/login");
    }
    

    res.render("profile", { user });
}

async function UpdateUserProfile(req, res) {
    try {
        const sessionId = req.cookies?.token;
        if (!sessionId) {
            return res.redirect("/login");
        }

        const user = getUser(sessionId);
        if (!user) {
            return res.redirect("/login");
        }

        // Ensure name exists in the request body
        if (!req.body.name) {
            console.log("No name provided in request body!");
            return res.render("profile", { updatedUser: user }); // Send existing user
        }

        // Update name in the database
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {_id:user._id, name: req.body.name,email:user.email },
            { new: true }
        );

        if (!updatedUser) {
            console.log("User update failed!");
            return res.render("profile", { user: user }); // Send existing user if update fails
        }

        console.log("Updated User:", updatedUser); // Debugging output

        const newToken = setUser(updatedUser);

        // **Set new token in cookies**
        res.cookie("token", newToken, {
            httpOnly: true,
            maxAge: 360 * 24 * 60 * 60 * 1000
        });

        return res.render("profile", { user:updatedUser });  // Pass updatedUser to profile.ejs
    } catch (error) {
        console.error("Error in UpdateUserProfile:", error);
        return res.status(500).send("Internal Server Error");
    }
}

async function LogOut(req,res){
    res.cookie("token", "", {
        path: "/",
        expires: new Date(0), // Expire the cookie
        httpOnly: true,
        secure: true
      });
      return res.render('signup')
}


export  {
    HandleUserSignup,
    HandleUserLogin,
    RenderingProfile,
    UpdateUserProfile,
    LogOut,
}




/* 

async function HandleUserSignup(req, res) {
    const { name, email, password } = req.body;

    // Check karein ki database me koi user hai ya nahi
    const userCount = await User.countDocuments({});
    const role = userCount === 0 ? "admin" : "normal";  // Pehla user admin hoga

    const person = await User.create({
        name,
        email,
        password,
        role: role
    });

    const token = setUser(person);

    res.cookie('token', token, {
        httpOnly: true,  
        maxAge: 360 * 24 * 60 * 60 * 1000
    });

    return res.render("index", { randomQuote: res.locals.randomQuote });
}


*/
